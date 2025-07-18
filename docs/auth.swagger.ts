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
          description: "Account Verification Code sent",
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
          description: "Bad Requests",
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
                  summary: "Expired verification code",
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
                  summary: "Expired verification code",
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
};

export default authSwagger;
