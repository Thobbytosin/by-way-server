export const userSignup = {
  type: "object",
  required: ["name", "email", "password"],
  properties: {
    name: {
      type: "string",
      example: "John Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "john@example.com",
    },
    password: {
      type: "string",
      format: "password",
      example: "SecurePassword123!",
    },
  },
};

export const accountVerfification = {
  type: "object",
  required: ["verificationCode"],
  properties: {
    activationCode: {
      type: "string",
      example: "000000",
    },
  },
};

export const successResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: true,
    },
    message: {
      type: "string",
      example: "An error message explaining what went wrong.",
    },
    data: {
      type: "any",
      example: "Any success type",
    },
    statusCode: {
      type: "number",
      example: "Error status code",
    },
  },
};

export const errorResponse = {
  type: "object",
  properties: {
    success: {
      type: "boolean",
      example: false,
    },
    message: {
      type: "string",
      example: "An error message explaining what went wrong.",
    },
    statusCode: {
      type: "number",
      example: "Error status code",
    },
  },
};

export const userSignin = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: {
      type: "string",
      format: "email",
      example: "john@example.com",
    },
    password: {
      type: "string",
      format: "password",
      example: "SecurePassword123!",
    },
  },
};

export const userSocialSignin = {
  type: "object",
  required: ["name", "email", "avatar"],
  properties: {
    name: {
      type: "string",
      example: "John Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "john@example.com",
    },
    avatar: {
      type: "string",
      example: "johndoe.png",
    },
  },
};

export const updateUserProfile = {
  type: "object",
  required: ["name", "email"],
  properties: {
    name: {
      type: "string",
      example: "John Doe",
    },
    email: {
      type: "string",
      format: "email",
      example: "john@example.com",
    },
  },
};

export const updateUserPassword = {
  type: "object",
  required: ["newPassword", "oldPassword"],
  properties: {
    oldPassword: {
      type: "string",
      format: "password",
      example: "SecurePassword123!",
    },
    newPassword: {
      type: "string",
      format: "password",
      example: "newSecurePassword123",
    },
  },
};
