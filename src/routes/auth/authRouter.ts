import type { FastifyInstance } from 'fastify';
import AuthController from '@controllers/auth/authController';
import { BaseRouter } from '@routes/baseRouter';
import { Public, Get, Post, Patch } from '@routes/decorators';
import type { Request, Response } from '@type/fastify';
import type { LoginBody, SignupBody } from '@type/auth';

import {
  verifyUserSchema,
  loginSchema,
  signupVerifySchema,
  signupSchema,
  restPasswordSchema
} from './auth.schema';

class AuthRouter extends BaseRouter {
  private controller: AuthController;

  constructor(app: FastifyInstance) {
    super(app);
    this.controller = new AuthController(app);
  }

  @Public()
  @Get('/signup/verify', signupVerifySchema)
  async verifySignupEmail(req: Request, res: Response) {
    const query = req.query as { email: string };
    const result = await this.controller.verifySignupEmail(query.email);
    return res.status(201).send(result);
  }

  @Public()
  @Post('/signup', signupSchema)
  async signup(req: Request, res: Response) {
    const result = await this.controller.signup(req.body as SignupBody);
    return res.status(201).send(result);
  }

  @Public()
  @Post('/login', loginSchema)
  async login(req: Request, res: Response) {
    const result = await this.controller.login(req.body as LoginBody);
    return res.send(result);
  }

  @Public()
  @Get('/verify', verifyUserSchema)
  async verifyEmailAndPhone(req: Request, res: Response) {
    const { email, phone } = req.query as { email: string; phone: string };
    const result = await this.controller.verifyEmailAndPhone(email, phone);
    return res.send(result);
  }

  @Public()
  @Patch('/resetpassword', restPasswordSchema)
  async resetPassword(req: Request, res: Response) {
    const { reset_key } = req.headers as { reset_key: string };
    const { email, password } = req.body as { email: string; password: string };
    const result = await this.controller.resetPassword(
      reset_key,
      email,
      password
    );
    return res.send(result);
  }
}

export default AuthRouter;
