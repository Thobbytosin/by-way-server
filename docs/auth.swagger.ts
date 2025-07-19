const authSwagger = {
  "/registration": {
    post: {
      summary: "Sign Up a User",
      operationId: "signUpUser",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserSignup",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Successful Verification code sent",
                  value: {
                    success: true,
                    message:
                      "A 6-digit verification code has been sent to your email.",
                    data: null,
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingFields: {
                  summary: "Missing required fields",
                  value: {
                    success: false,
                    message: "All fields are required",
                    statusCode: 400,
                  },
                },
                invalidEmail: {
                  summary: "Invalid email format",
                  value: {
                    success: false,
                    message: "Please enter a valid email",
                    statusCode: 400,
                  },
                },
                weakPassword: {
                  summary: "Weak password length",
                  value: {
                    success: false,
                    message: "Password security is too weak",
                    statusCode: 400,
                  },
                },
                failedMail: {
                  summary: "Verification mail failed",
                  value: {
                    success: false,
                    message: "Failed to send mail",
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example:
                      "Account already exists. Please proceed to sign in to your account",
                  },
                  statusCode: { type: "number", example: 409 },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },

  "/activate-user": {
    post: {
      summary: "Verify User Email",
      operationId: "verifyEmail",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      security: [
        {
          cookieVerification: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/AccountVerfification",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Account Verification Success",
                  value: {
                    success: true,
                    message: "Account verified successfully",
                    data: null,
                    statusCode: 201,
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingVerificationCode: {
                  summary: "Account not found",
                  value: {
                    success: false,
                    message: "Verification code has expired",
                    statusCode: 401,
                  },
                },
                expiredSession: {
                  summary: "Expired Session",
                  value: {
                    success: false,
                    message: "Session has ended.",
                    statusCode: 401,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                erroresponse: {
                  summary: "Invalid verification code",
                  value: {
                    success: false,
                    message: "Invalid verification code",
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        409: {
          description: "Conflict",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                erroresponse: {
                  summary: "Account already exists",
                  value: {
                    success: false,
                    message: "Account already exists",
                    statusCode: 409,
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },

  "/login": {
    post: {
      summary: "Login User",
      operationId: "loginUser",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserSignin",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Login Success",
                  value: {
                    success: true,
                    message: "Logged in successfully",
                    data: {
                      _id: "secure_user_Id",
                      name: "John Doe",
                      email: "john@example.com",
                      avatar: {
                        id: "secure_user_Id",
                        url: "secure_user_Id.png",
                      },
                      role: "user",
                      isVerified: true,
                      courses: null,
                      expiresAt: 1721326600000,
                    },
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingFields: {
                  summary: "Missing required fields",
                  value: {
                    success: false,
                    message: "Please enter your email and password",
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                wrongCredentials: {
                  summary: "Invalid credentials",
                  value: {
                    success: false,
                    message: "Invalid credentials.",
                    statusCode: 401,
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                accountNotFound: {
                  summary: "Account not found",
                  value: {
                    success: false,
                    message: "Account not found",
                    statusCode: 404,
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },

  "/social-auth": {
    post: {
      summary: "Social Authentication",
      operationId: "social-auth",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserSignSocialin",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Login Success",
                  value: {
                    success: true,
                    message: "Logged in successfully",
                    data: {
                      _id: "secure_user_Id",
                      name: "John Doe",
                      email: "john@example.com",
                      avatar: {
                        id: "secure_user_Id",
                        url: "secure_user_Id.png",
                      },
                      role: "user",
                      isVerified: true,
                      courses: null,
                    },
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingParameters: {
                  summary: "Missing required parameters",
                  value: {
                    success: false,
                    message: "Please provide name and email",
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },

  "/logout": {
    post: {
      summary: "Logout",
      operationId: "logout",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UserSignSocialin",
            },
          },
        },
      },
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Logout Success",
                  value: {
                    success: true,
                    message: "Logout successfully",
                    data: null,
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },

  "/refresh-tokens": {
    get: {
      summary: "Refresh Tokens",
      operationId: "refreshTokens",
      tags: ["Authentication"],
      parameters: [
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
          },
          description:
            "User's cookie consent object (used to determine if request is allowed)",
        },
      ],
      security: [
        {
          cookieRefresh: [],
        },
      ],
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Tokens Refreshed",
                  value: {
                    success: true,
                    message: "Tokens Refreshed",
                    data: {
                      expiresAt: 1721326600000,
                    },
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                missingToken: {
                  summary: "Missing token",
                  value: {
                    success: false,
                    message: "Token is required",
                    statusCode: 400,
                  },
                },
              },
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                expiredToken: {
                  summary: "Expired Token",
                  value: {
                    success: false,
                    message: "Session has ended.",
                    statusCode: 401,
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                accountNotFound: {
                  summary: "Account not found",
                  value: {
                    success: false,
                    message: "Account not found",
                    statusCode: 404,
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/InternalServerError" },
      },
    },
  },
};

export default authSwagger;
