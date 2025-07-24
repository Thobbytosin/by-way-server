const adminSwagger = {
  "/get-all-users": {
    get: {
      summary: "All Users",
      operationId: "all-users",
      tags: ["Admin"],
      parameters: [
        {
          in: "header",
          name: "x-swagger-mock",
          required: true,
          schema: {
            type: "string",
            example: "true",
          },
        },
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
            example: '{"accept": false}',
          },
          description:
            "User's cookie consent object (used to determine if request is allowed). Must be a stringified JSON object like: accept: true or accept: false",
        },
      ],
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: "Users fetched",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Users fetched",
                  value: {
                    success: true,
                    message: "Users fetched",
                    data: [
                      {
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
                      {
                        _id: "secure_user_Id2",
                        name: "Mary Zane",
                        email: "maryzane@example.com",
                        avatar: {
                          id: "secure_user_Id",
                          url: "secure_user_Id.png",
                        },
                        role: "user",
                        isVerified: true,
                        courses: null,
                      },
                    ],
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
                missingAuthToken: {
                  summary: "Missing Auth token",
                  value: {
                    success: false,
                    message: "Authentication token required.",
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
                  summary: "Expired Auth Token",
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
        403: {
          description: "Restricted Page",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                restrictedResource: {
                  summary: "Restricted Page",
                  value: {
                    success: false,
                    message:
                      "Role: You are restricted to access this resource.",
                    statusCode: 403,
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

  "/update-user-role": {
    put: {
      summary: "All Users",
      operationId: "all-users",
      tags: ["Admin"],
      parameters: [
        {
          in: "header",
          name: "x-swagger-mock",
          required: true,
          schema: {
            type: "string",
            example: "true",
          },
        },
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
            example: '{"accept": false}',
          },
          description:
            "User's cookie consent object (used to determine if request is allowed). Must be a stringified JSON object like: accept: true or accept: false",
        },
      ],
      security: [
        {
          cookieAuth: [],
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/UpdateUserRole",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Role updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Role updated",
                  value: {
                    success: true,
                    message: "Role updated",
                    data: null,
                    statusCode: 201,
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
                  summary: "Missing Fields",
                  value: {
                    success: false,
                    message: "Please provide your email and select a role",
                    statusCode: 400,
                  },
                },
                missingAuthToken: {
                  summary: "Missing Auth token",
                  value: {
                    success: false,
                    message: "Authentication token required.",
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
                  summary: "Expired Auth Token",
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
        403: {
          description: "Restricted Page",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                restrictedResource: {
                  summary: "Restricted Page",
                  value: {
                    success: false,
                    message:
                      "Role: You are restricted to access this resource.",
                    statusCode: 403,
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

  "/delete-user/{userId}": {
    delete: {
      summary: "Delete user account by id",
      operationId: "delete-user",
      tags: ["Admin"],
      parameters: [
        {
          in: "header",
          name: "x-swagger-mock",
          required: true,
          schema: {
            type: "string",
            example: "true",
          },
        },
        {
          in: "header",
          name: "x-cookie-consent",
          required: true,
          schema: {
            type: "string",
            example: '{"accept": false}',
          },
          description:
            "User's cookie consent object (used to determine if request is allowed). Must be a stringified JSON object like: accept: true or accept: false",
        },
        {
          in: "path",
          name: "userId",
          schema: {
            type: "string",
          },
          description: "User's id to be deleted",
        },
      ],
      security: [
        {
          cookieAuth: [],
        },
      ],
      responses: {
        200: {
          description: "User account deleted",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "User account deleted",
                  value: {
                    success: true,
                    message: "User account deleted",
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
                missingAuthToken: {
                  summary: "Missing Auth token",
                  value: {
                    success: false,
                    message: "Authentication token required.",
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
                  summary: "Expired Auth Token",
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
        403: {
          description: "Restricted Page",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                restrictedResource: {
                  summary: "Restricted Page",
                  value: {
                    success: false,
                    message:
                      "Role: You are restricted to access this resource.",
                    statusCode: 403,
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

export default adminSwagger;
