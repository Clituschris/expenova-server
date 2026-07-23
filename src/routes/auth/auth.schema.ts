export const userDetailSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string' }
  }
};

export const signupVerifySchema = {
  tags: ['Auth'],
  summary: 'Verify email for Signup',
  querystring: {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
      email: { type: 'string', format: 'email' }
    }
  },
  response: {
    200: {
      description: 'Success Response',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    default: { $ref: 'errorResponse' }
  }
};

export const signupSchema = {
  tags: ['Auth'],
  summary: 'Sign up',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'name', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      name: { type: 'string', minLength: 2 },
      phone: { type: 'string', pattern: '^[0-9]{10,15}$' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    201: {
      description: 'Success Response',
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: userDetailSchema
      }
    },
    default: { $ref: 'errorResponse' }
  }
};

export const loginSchema = {
  tags: ['Auth'],
  summary: 'Login',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    200: {
      description: 'Success Response',
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: userDetailSchema
      }
    },
    default: { $ref: 'errorResponse' }
  }
};

export const getResetKeySchema = {
  tags: ['Auth'],
  summary: 'Get Reset key for resetting password',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'phone'],
    properties: {
      email: { type: 'string', format: 'email' },
      phone: { type: 'string', pattern: '^[0-9]{10,15}$' }
    }
  },
  response: {
    200: {
      description: 'Success Response',
      type: 'object',
      properties: {
        reset_key: { type: 'string' }
      }
    },
    default: { $ref: 'errorResponse' }
  }
};

export const resetPasswordSchema = {
  tags: ['Auth'],
  summary: 'Reset user password',
  headers: {
    type: 'object',
    required: ['reset_key'],
    properties: {
      reset_key: { type: 'string' }
    }
  },
  body: {
    description: 'Success Response',
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    200: {
      description: 'Success Response',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    default: { $ref: 'errorResponse' }
  }
};

export const verifyTokenSchema = {
  tags: ['Auth'],
  summary: 'Verify Auth Token',
  response: {
    200: {
      description: 'Success Response',
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            iat: { type: 'number' },
            exp: { type: 'number' }
          }
        }
      }
    },
    default: { $ref: 'errorResponse' }
  }
};
