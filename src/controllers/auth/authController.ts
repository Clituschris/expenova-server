import bcrypt from 'bcryptjs';
import type { FastifyInstance } from 'fastify';
import {
  createUser,
  findUserByEmail,
  getUserByEmailAndPhone,
  updateLastLogin,
  updateUserPassword
} from '@db/users';
import type { AuthResult, LoginBody, SignupBody } from '@type/auth';
import { conflict, unauthorized } from '@utils/common';

const SALT_ROUNDS = 10;

class AuthController {
  constructor(private app: FastifyInstance) {}

  private signToken(user: { id: string; email: string }) {
    return this.app.jwt.sign(
      { sub: user.id, email: user.email },
      { expiresIn: '1d' }
    );
  }

  async verifySignupEmail(email: string): Promise<{ message: string }> {
    const user = await findUserByEmail(email);
    if (user) {
      throw conflict('Email is already registered');
    }

    return {
      message: 'Valid email address'
    };
  }

  async signup(body: SignupBody): Promise<AuthResult> {
    const _user = await findUserByEmail(body.email);
    if (_user) {
      throw conflict('Email is already registered');
    }

    const password_hash = await bcrypt.hash(body.password, SALT_ROUNDS);
    const user = await createUser({
      email: body.email,
      name: body.name,
      phone: body.phone,
      password_hash
    });

    return {
      message: 'Registered successfully',
      token: this.signToken(user),
      user: { id: user.id, email: user.email, name: user.name }
    };
  }

  async login(body: LoginBody): Promise<AuthResult> {
    const user = await findUserByEmail(body.email);
    if (!user) {
      throw unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(
      body.password,
      user.password_hash
    );
    if (!passwordMatches) {
      throw unauthorized('Invalid email or password');
    }

    if (!user.is_active) {
      throw unauthorized('Account is inactive');
    }

    await updateLastLogin(user.id);

    return {
      message: 'Login successfully',
      token: this.signToken(user),
      user: { id: user.id, email: user.email, name: user.name }
    };
  }

  async verifyEmailAndPhone(
    email: string,
    phone: string
  ): Promise<{ reset_key: string }> {
    const user = await getUserByEmailAndPhone(email, phone);
    if (!user) {
      throw unauthorized('Invalid email or phone');
    }

    const reset_key = await bcrypt.hash(user.id, SALT_ROUNDS);

    return {
      reset_key
    };
  }

  async resetPassword(
    reset_key: string,
    email: string,
    password: string
  ): Promise<AuthResult> {
    if (!reset_key) {
      throw unauthorized('Reset key not found');
    }

    const _user = await findUserByEmail(email);
    if (!_user) {
      throw unauthorized('Invalid Email');
    }
    const isValidResetKey = await bcrypt.compare(_user.id, reset_key);

    if (!isValidResetKey) {
      throw unauthorized(`Invalid reset key`);
    }
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await updateUserPassword(email, password_hash);

    return {
      message: 'Password reset successfully',
      user: { id: user.id, email: user.email, name: user.name }
    };
  }
}

export default AuthController;
