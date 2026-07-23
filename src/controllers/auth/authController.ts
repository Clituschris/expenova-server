import type { FastifyInstance } from 'fastify';
import type { Request } from '@type/fastify';
import bcrypt from 'bcryptjs';
import { badRequest, conflict, internal, unauthorized } from '@utils/common';
import type { LoginBody, ResetKeyBody, SignupBody } from '@type/auth';
import {
  createUser,
  findUserByEmail,
  getUserByEmailAndPhone,
  updateLastLogin,
  updateUserPassword
} from '@db/users';

const SALT_ROUNDS = 10;

class AuthController {
  constructor(private app: FastifyInstance) {}

  private signToken(user: { id: string; name: string; email: string }) {
    try {
      return this.app.jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        { expiresIn: '1d' }
      );
    } catch (err) {
      throw internal('Failed to sign auth token', err);
    }
  }

  async verifySignupEmail(req: Request) {
    const { email } = req.query as { email: string };
    const user = await findUserByEmail(email);
    if (user) {
      throw conflict('Email is already registered');
    }

    return {
      message: 'Valid email address'
    };
  }

  async signup(req: Request) {
    const { name, email, phone, password } = req.body as SignupBody;
    const existing = await findUserByEmail(email);
    if (existing) {
      throw conflict('Email is already registered');
    }

    let password_hash: string;
    try {
      password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
      throw internal('Failed to hash password', err);
    }

    // createUser also guards against the email-uniqueness race condition
    const user = await createUser({
      email: email,
      name: name,
      phone: phone,
      password_hash
    });

    return {
      message: 'Registered successfully',
      token: this.signToken(user),
      user: {
        name: user.name,
        email: user.email
      }
    };
  }

  async login(req: Request) {
    const { email, password } = req.body as LoginBody;
    const user = await findUserByEmail(email);
    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    let passwordMatches: boolean;
    try {
      passwordMatches = await bcrypt.compare(password, user.password_hash);
    } catch (err) {
      throw internal('Failed to verify password', err);
    }

    if (!passwordMatches) {
      throw unauthorized('Invalid email or password');
    }

    if (!user.is_active) {
      throw unauthorized('Account is inactive');
    }

    await updateLastLogin(user.id); // non-throwing, logs internally on failure

    return {
      message: 'Login successfully',
      token: this.signToken(user),
      user: {
        name: user.name,
        email: user.email
      }
    };
  }

  async generateResetPasswordKey(req: Request) {
    const { email, phone } = req.body as ResetKeyBody;
    const user = await getUserByEmailAndPhone(email, phone);
    if (!user) {
      throw badRequest('Invalid email or phone');
    }

    try {
      const reset_key = await bcrypt.hash(user.id, SALT_ROUNDS);
      return {
        reset_key
      };
    } catch (err) {
      throw internal('Failed to generate reset key', err);
    }
  }

  async resetPassword(req: Request) {
    const { reset_key } = req.headers as { reset_key: string };
    const { email, password } = req.body as { email: string; password: string };
    if (!reset_key) {
      throw unauthorized('Reset key not found');
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw unauthorized('Invalid email');
    }

    let isValidResetKey: boolean;
    try {
      isValidResetKey = await bcrypt.compare(user.id, reset_key);
    } catch (err) {
      throw unauthorized('Invalid reset key');
    }

    if (!isValidResetKey) {
      throw unauthorized('Invalid reset key');
    }

    let password_hash: string;
    try {
      password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
      throw internal('Failed to hash password', err);
    }

    await updateUserPassword(email, password_hash);

    return {
      message: 'Password reset successfully'
    };
  }

  verifyAuthToken(req: Request) {
    const user = req.user;
    return {
      message: 'Valid token',
      user
    };
  }
}

export default AuthController;
