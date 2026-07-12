const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    email: { type: 'string' },
    name: { type: 'string' }
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
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
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
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: userSchema
      }
    }
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
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        token: { type: 'string' },
        user: userSchema
      }
    }
  }
};

export const verifyUserSchema = {
  tags: ['Auth'],
  summary: 'Verify user by email and phone',
  querystring: {
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
      type: 'object',
      properties: {
        reset_key: { type: 'string' }
      }
    }
  }
};

export const restPasswordSchema = {
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
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    }
  },
  response: {
    201: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        user: userSchema
      }
    }
  }
};
