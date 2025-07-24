const userSwagger = {
  "/me": {
    get: {
      summary: "User Details",
      operationId: "user-details",
      tags: ["User"],
      parameters: [
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
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "User details fetched",
                  value: {
                    success: true,
                    message: "User fetched",
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

  "/update-user-info": {
    put: {
      summary: "Update User Profile",
      operationId: "user-details",
      tags: ["User"],
      parameters: [
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
              $ref: "#/components/schemas/UpdateUserProfile",
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
                  summary: "Profile updated",
                  value: {
                    success: true,
                    message: "Profile updated",
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
                    message: "Fields are required.",
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
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                accountNotFound: {
                  summary: "User not found",
                  value: {
                    success: false,
                    message: "User not found",
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

  "/update-user-password": {
    put: {
      summary: "Update User Password",
      operationId: "user-password",
      tags: ["User"],
      parameters: [
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
              $ref: "#/components/schemas/UpdateUserPassword",
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
                  summary: "Password updated",
                  value: {
                    success: true,
                    message: "Password updated",
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
                    message: "Please enter old and new password",
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
                invalidOldPassword: {
                  summary: "Invalid old password",
                  value: {
                    success: false,
                    message: "Invalid old password",
                    statusCode: 401,
                  },
                },
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
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                accountNotFound: {
                  summary: "Forbidden",
                  value: {
                    success: false,
                    message: "New password must be different from old password",
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
                  summary: "User not found",
                  value: {
                    success: false,
                    message: "Invalid user",
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

  "/update-profile-picture": {
    put: {
      summary: "Update Profile Image",
      operationId: "user-profile-image",
      tags: ["User"],
      parameters: [
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
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["avatar"],
              properties: {
                avatar: {
                  type: "string",
                  format: "binary",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Profile image updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Profile image updated",
                  value: {
                    success: true,
                    message: "Profile image updated",
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
                missingAvatar: {
                  summary: "Missing avatar field",
                  value: {
                    success: false,
                    message: "Please provide an image",
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
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                multipkleImages: {
                  summary: "Forbidden",
                  value: {
                    success: false,
                    message: "Multiple images not allowed",
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
                  summary: "User not found",
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
        422: {
          description: "Unprocessable Entity",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                multipleImages: {
                  summary: "Wrong image format",
                  value: {
                    success: false,
                    message:
                      "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
                    statusCode: 422,
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

  "/get-admin-list": {
    get: {
      summary: "Admin List",
      operationId: "admin-list",
      tags: ["User"],
      parameters: [
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
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Admin list fetched",
                  value: {
                    success: true,
                    message: "Admin list fetched",
                    data: [
                      {
                        _id: "secure_user_Id",
                        name: "John Doe",
                        email: "john@example.com",
                        avatar: {
                          id: "secure_user_Id",
                          url: "secure_user_Id.png",
                        },
                        role: "admin",
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
        404: {
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                accountNotFound: {
                  summary: "Admin list not found",
                  value: {
                    success: false,
                    message: "Admin list not found",
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

  "/update-user-videos-viewed": {
    put: {
      summary: "Update Viewed Courses",
      operationId: "update-viewed-courses",
      tags: ["User"],
      parameters: [
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
              $ref: "#/components/schemas/UpdateViewedCourses",
            },
          },
        },
      },
      responses: {
        201: {
          description: "Video Completed",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Video updated",
                  value: {
                    success: true,
                    message: "You have completed this lesson. Well done!",
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
                missingAvatar: {
                  summary: "Missing avatar field",
                  value: {
                    success: false,
                    message: "Please provide an image",
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
          description: "Forbidden",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                multipkleImages: {
                  summary: "Forbidden",
                  value: {
                    success: false,
                    message: "Multiple images not allowed",
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
                  summary: "User not found",
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
        422: {
          description: "Unprocessable Entity",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                invalidId: {
                  summary: "Invalid User Id",
                  value: {
                    success: false,
                    message: "Invalid user id",
                    statusCode: 422,
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

  "/get-users-list": {
    get: {
      summary: "Users Latest list",
      operationId: "users-latest-list",
      tags: ["User"],
      parameters: [
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
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Users list fetched",
                  value: {
                    success: true,
                    message: "Users list fetched",
                    data: [
                      {
                        _id: "secure_user_Id",
                        name: "John Doe",
                        avatar: {
                          id: "secure_user_Id",
                          url: "secure_user_Id.png",
                        },
                        role: "user",
                      },
                      {
                        _id: "secure_user_Id2",
                        name: "John Doe",
                        avatar: {
                          id: "secure_user_Id2",
                          url: "secure_user_Id2.png",
                        },
                        role: "user",
                      },
                    ],
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Users not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                usersNotFound: {
                  summary: "Users not found",
                  value: {
                    success: false,
                    message: "Users not found",
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

  "/get-admin": {
    get: {
      summary: "Get Admin",
      operationId: "get-admin",
      tags: ["User"],
      parameters: [
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
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Admin fetched",
                  value: {
                    success: true,
                    message: "Admin fetched",
                    data: {
                      _id: "secure_user_Id",
                      name: "John Doe",
                      avatar: {
                        id: "secure_user_Id",
                        url: "secure_user_Id.png",
                      },
                      role: "admin",
                    },

                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Admin not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                usersNotFound: {
                  summary: "Admin not found",
                  value: {
                    success: false,
                    message: "Admin not found",
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

  "/get-user-courses-summary": {
    get: {
      summary: "User Courses Summary",
      operationId: "user-courses-summary",
      tags: ["User"],
      parameters: [
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
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Users list fetched",
                  value: {
                    success: true,
                    message: "Request Success",
                    data: [
                      {
                        id: "course-a-id",
                        name: "Course A",
                        thumbnail: "courseA.png",
                        ratings: 4.5,
                        purchase: 28,
                        progress: [
                          { videoId: "video1-id", viewed: true },
                          { videoId: "video2-id", viewed: false },
                        ],
                        reviewed: false,
                      },
                    ],
                    statusCode: 200,
                  },
                },
              },
            },
          },
        },
        404: {
          description: "User or courses not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                usersNotFound: {
                  summary: "User or courses not found",
                  value: {
                    success: false,
                    message: "User or courses not found",
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

export default userSwagger;
