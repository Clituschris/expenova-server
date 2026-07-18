import type { FastifyInstance } from 'fastify';
import AuthController from '@controllers/auth/authController';
import { BaseRouter } from '@routes/baseRouter';
import { Public, Get, Post, Patch } from '@routes/decorators';
import type { Request, Response } from '@type/fastify';

import {
  loginSchema,
  signupVerifySchema,
  signupSchema,
  getResetKeySchema,
  resetPasswordSchema,
  verifyTokenSchema
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
    const result = await this.controller.verifySignupEmail(req);
    return res.status(200).send(result);
  }

  @Public()
  @Post('/signup', signupSchema)
  async signup(req: Request, res: Response) {
    const result = await this.controller.signup(req);
    return res.status(201).send(result);
  }

  @Public()
  @Post('/login', loginSchema)
  async login(req: Request, res: Response) {
    const result = await this.controller.login(req);
    return res.send(result);
  }

  @Public()
  @Post('/resetpassword/resetkey', getResetKeySchema)
  async getResetPasswordKey(req: Request, res: Response) {
    const result = await this.controller.generateResetPasswordKey(req);
    return res.send(result);
  }

  @Public()
  @Patch('/resetpassword', resetPasswordSchema)
  async resetPassword(req: Request, res: Response) {
    const result = await this.controller.resetPassword(req);
    return res.send(result);
  }

  @Get('/verify-token', verifyTokenSchema)
  verifyAuthToken(req: Request, res: Response) {
    const result = this.controller.verifyAuthToken(req);
    return res.send(result);
  }
}

export default AuthRouter;
