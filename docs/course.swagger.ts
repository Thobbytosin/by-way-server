const courseSwagger = {
  "/create-course": {
    post: {
      summary: "Upload Course",
      operationId: "upload-course",
      tags: ["Course"],
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
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "name",
                "level",
                "tags",
                "avatar",
                "description",
                "price",
                "thumbnail",
                "demoVideo",
                "category",
                "courseData",
                "benefits",
                "prerequisites",
              ],
              properties: {
                name: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                price: {
                  type: "number",
                },
                estimatedPrice: {
                  type: "number",
                },
                thumbnail: {
                  type: "string",
                  format: "binary",
                },
                tags: {
                  type: "string",
                },
                level: {
                  type: "string",
                },
                category: {
                  type: "string",
                },
                demoVideo: {
                  type: "string",
                  format: "binary",
                },
                benefits: { type: "array" },
                prerequisites: { type: "array" },
                reviews: { type: "array" },
                courseData: { type: "array" },
                ratings: { type: "number" },
                purchase: { type: "number" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Course uploaded",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Course uploaded",
                  value: {
                    success: true,
                    message: "Course uploaded",
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
                    message: "Fields are missing.",
                    statusCode: 400,
                  },
                },
                missingVideo: {
                  summary: "Missing Intro Video",
                  value: {
                    success: false,
                    message: "Upload Course Intro Video",
                    statusCode: 400,
                  },
                },
                missingBanner: {
                  summary: "Missing Course Banner",
                  value: {
                    success: false,
                    message: "Upload Course Banner",
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
                imageUploadError: {
                  summary: "Failed to upload image",
                  value: {
                    success: false,
                    message: "Failed to upload image to server",
                    statusCode: 401,
                  },
                },
                videoUploadError: {
                  summary: "Failed to upload video",
                  value: {
                    success: false,
                    message: "Failed to upload video to server",
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
        413: {
          description: "Large File Upload",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                largeVideoUpload: {
                  summary: "Large video upload",
                  value: {
                    success: false,
                    message: "Video exceeds 10MB limit",
                    statusCode: 413,
                  },
                },
              },
            },
          },
        },
        422: {
          description: "Unprocessable",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                multipleImages: {
                  summary: "Multiple Images ",
                  value: {
                    success: false,
                    message: "Multiple images not allowed",
                    statusCode: 422,
                  },
                },
                multipleVideos: {
                  summary: "Multiple Videos ",
                  value: {
                    success: false,
                    message: "Multiple videos not allowed",
                    statusCode: 422,
                  },
                },
                invalidImageFormat: {
                  summary: "Invalid image format",
                  value: {
                    success: false,
                    message:
                      "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
                    statusCode: 422,
                  },
                },
                invalidVideoeFormat: {
                  summary: "Invalid video format",
                  value: {
                    success: false,
                    message:
                      "Invalid video format. File must be a video (e.g., .mp4, .mov)",
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

  "/edit-course/{course_id}": {
    put: {
      summary: "Update Course by id",
      operationId: "upload-course",
      tags: ["Course"],
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
          name: "course_id",
          schema: {
            type: "string",
          },
          description: "Course's id to be updated",
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
              required: [
                "name",
                "level",
                "tags",
                "avatar",
                "description",
                "price",
                "thumbnail",
                "demoVideo",
                "category",
                "courseData",
                "benefits",
                "prerequisites",
              ],
              properties: {
                name: {
                  type: "string",
                },
                description: {
                  type: "string",
                },
                price: {
                  type: "number",
                },
                estimatedPrice: {
                  type: "number",
                },
                thumbnail: {
                  type: "string",
                  format: "binary",
                },
                tags: {
                  type: "string",
                },
                level: {
                  type: "string",
                },
                category: {
                  type: "string",
                },
                demoVideo: {
                  type: "string",
                  format: "binary",
                },
                benefits: { type: "array" },
                prerequisites: { type: "array" },
                reviews: { type: "array" },
                courseData: { type: "array" },
                ratings: { type: "number" },
                purchase: { type: "number" },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Course updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Course updated",
                  value: {
                    success: true,
                    message: "Course updated",
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
                    message: "Fields are missing.",
                    statusCode: 400,
                  },
                },
                missingVideo: {
                  summary: "Missing Intro Video",
                  value: {
                    success: false,
                    message: "Upload Course Intro Video",
                    statusCode: 400,
                  },
                },
                missingBanner: {
                  summary: "Missing Course Banner",
                  value: {
                    success: false,
                    message: "Upload Course Banner",
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
                imageUploadError: {
                  summary: "Failed to upload image",
                  value: {
                    success: false,
                    message: "Failed to upload image to server",
                    statusCode: 401,
                  },
                },
                videoUploadError: {
                  summary: "Failed to upload video",
                  value: {
                    success: false,
                    message: "Failed to upload video to server",
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
                  summary: "User not found",
                  value: {
                    success: false,
                    message: "User not found",
                    statusCode: 404,
                  },
                },
                courseNotFound: {
                  summary: "Course not found",
                  value: {
                    success: false,
                    message: "Course not found",
                    statusCode: 404,
                  },
                },
              },
            },
          },
        },
        413: {
          description: "Large File Upload",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                largeVideoUpload: {
                  summary: "Large video upload",
                  value: {
                    success: false,
                    message: "Video exceeds 10MB limit",
                    statusCode: 413,
                  },
                },
              },
            },
          },
        },
        422: {
          description: "Unprocessable",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                multipleImages: {
                  summary: "Multiple Images ",
                  value: {
                    success: false,
                    message: "Multiple images not allowed",
                    statusCode: 422,
                  },
                },
                multipleVideos: {
                  summary: "Multiple Videos ",
                  value: {
                    success: false,
                    message: "Multiple videos not allowed",
                    statusCode: 422,
                  },
                },
                invalidImageFormat: {
                  summary: "Invalid image format",
                  value: {
                    success: false,
                    message:
                      "Invalid image format. File must be an image(.jpg, .png, .jpeg)",
                    statusCode: 422,
                  },
                },
                invalidVideoeFormat: {
                  summary: "Invalid video format",
                  value: {
                    success: false,
                    message:
                      "Invalid video format. File must be a video (e.g., .mp4, .mov)",
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

  "/get-course/{course_id}": {
    get: {
      summary: "Fetch course details by id",
      operationId: "get-course-details",
      tags: ["Course"],
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
          name: "course_id",
          schema: {
            type: "string",
          },
          description: "Course's id to be fetched",
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
                  summary: "Course fetched",
                  value: {
                    success: true,
                    message: "Course fetched",
                    data: {
                      _id: "course_Id",
                      name: "New Course",
                      description: "A new course",
                      price: 25000,
                      estimatedPrice: 43000,
                      thumbnail: {
                        id: "course-id",
                        url: "course.png",
                      },
                      tags: "CSS, HTML",
                      level: "Beginner",
                      demoVideo: {
                        id: "video-id",
                        url: "video.png",
                      },
                      category: "Web Development",
                      benefits: [
                        { title: "Great for beginners" },
                        { title: "Free for first month" },
                      ],
                      prerequisites: [{ title: "Must have a laptop" }],
                      reviews: [
                        {
                          user: {
                            avatar: {
                              id: "user-id",
                              url: "user-avatar.png",
                            },
                            _id: "671346148e802b614810fc51",
                            name: "User A",
                            email: "user@example.com",
                            role: "user",
                            isVerified: true,
                            courses: [
                              {
                                courseId: "xjhdhds98lopd",
                                progress: [
                                  {
                                    videoId: "alopwb83hd",
                                    viewed: true,
                                    _id: "bche903ndbdb",
                                  },
                                ],
                                reviewed: false,
                                _id: "iuw8eve9892hd",
                              },
                            ],
                          },
                          rating: 4.1,
                          comment: "Loved it",
                          commentReplies: [
                            {
                              user: {
                                avatar: {
                                  id: "user-id-2",
                                  url: "user-avatar-2.png",
                                },
                                _id: "xxdd1616622",
                                name: "User B",
                                email: "userB@example.com",
                                role: "user",
                                isVerified: true,
                              },
                              reply: "I like it too",
                              _id: "user-id",
                              createdAt: "2025-06-06T19:49:44.923+00:00",
                              updatedAt: "2025-06-06T19:49:44.923+00:00",
                            },
                          ],
                        },
                      ],
                      ratings: 3.7,
                      purchase: 20,
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
                  summary: "User not found",
                  value: {
                    success: false,
                    message: "User not found",
                    statusCode: 404,
                  },
                },
                courseNotFound: {
                  summary: "Course not found",
                  value: {
                    success: false,
                    message: "Course not found",
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

  "/get-courses": {
    get: {
      summary: "Fetch courses (Unauthenticated)",
      operationId: "get-courses-unauthenticated",
      tags: ["Course"],
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
      responses: {
        200: {
          description: "OK",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SuccessResponse" },
              examples: {
                successResponse: {
                  summary: "Courses fetched",
                  value: {
                    success: true,
                    message: "Courses fetched",
                    data: [
                      {
                        _id: "course_Id",
                        name: "New Course",
                        description: "A new course",
                        price: 25000,
                        estimatedPrice: 43000,
                        thumbnail: {
                          id: "course-id",
                          url: "course.png",
                        },
                        tags: "CSS, HTML",
                        level: "Beginner",
                        demoVideo: {
                          id: "video-id",
                          url: "video.png",
                        },
                        category: "Web Development",
                        benefits: [
                          { title: "Great for beginners" },
                          { title: "Free for first month" },
                        ],
                        prerequisites: [{ title: "Must have a laptop" }],
                        reviews: [
                          {
                            user: {
                              avatar: {
                                id: "user-id",
                                url: "user-avatar.png",
                              },
                              _id: "671346148e802b614810fc51",
                              name: "User A",
                              email: "user@example.com",
                              role: "user",
                              isVerified: true,
                            },
                            rating: 4.1,
                            comment: "Loved it",
                            commentReplies: [
                              {
                                user: {
                                  avatar: {
                                    id: "user-id-2",
                                    url: "user-avatar-2.png",
                                  },
                                  _id: "xxdd1616622",
                                  name: "User B",
                                  email: "userB@example.com",
                                  role: "user",
                                  isVerified: true,
                                },
                                reply: "I like it too",
                                _id: "user-id",
                                createdAt: "2025-06-06T19:49:44.923+00:00",
                                updatedAt: "2025-06-06T19:49:44.923+00:00",
                              },
                            ],
                          },
                        ],
                        ratings: 3.7,
                        purchase: 20,
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
          description: "Not Found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                coursesNotFound: {
                  summary: "Courses not fetched",
                  value: {
                    success: false,
                    message: "Error fetching courses",
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

  "/get-course-free/{course_id}": {
    get: {
      summary: "(Unauthenticated) Fetch course details by id",
      operationId: "get-course-details-unauntenticated",
      tags: ["Course"],
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
          name: "course_id",
          schema: {
            type: "string",
          },
          description: "Course's id to be fetched",
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
                  summary: "Course fetched",
                  value: {
                    success: true,
                    message: "Course fetched",
                    data: {
                      _id: "course_Id",
                      name: "New Course",
                      description: "A new course",
                      price: 25000,
                      estimatedPrice: 43000,
                      thumbnail: {
                        id: "course-id",
                        url: "course.png",
                      },
                      tags: "CSS, HTML",
                      level: "Beginner",
                      demoVideo: {
                        id: "video-id",
                        url: "video.png",
                      },
                      category: "Web Development",
                      benefits: [
                        { title: "Great for beginners" },
                        { title: "Free for first month" },
                      ],
                      prerequisites: [{ title: "Must have a laptop" }],
                      reviews: [
                        {
                          user: {
                            avatar: {
                              id: "user-id",
                              url: "user-avatar.png",
                            },
                            _id: "671346148e802b614810fc51",
                            name: "User A",
                            email: "user@example.com",
                            role: "user",
                            isVerified: true,
                            courses: [
                              {
                                courseId: "xjhdhds98lopd",
                                progress: [
                                  {
                                    videoId: "alopwb83hd",
                                    viewed: true,
                                    _id: "bche903ndbdb",
                                  },
                                ],
                                reviewed: false,
                                _id: "iuw8eve9892hd",
                              },
                            ],
                          },
                          rating: 4.1,
                          comment: "Loved it",
                          commentReplies: [
                            {
                              user: {
                                avatar: {
                                  id: "user-id-2",
                                  url: "user-avatar-2.png",
                                },
                                _id: "xxdd1616622",
                                name: "User B",
                                email: "userB@example.com",
                                role: "user",
                                isVerified: true,
                              },
                              reply: "I like it too",
                              _id: "reply-id",
                              createdAt: "2025-06-06T19:49:44.923+00:00",
                              updatedAt: "2025-06-06T19:49:44.923+00:00",
                            },
                          ],
                        },
                      ],
                      ratings: 3.7,
                      purchase: 20,
                    },
                    statusCode: 200,
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
                courseNotFound: {
                  summary: "Course not found",
                  value: {
                    success: false,
                    message: "Course not found",
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

  "/get-course-content/{course_id}": {
    get: {
      summary: "Fetch course content by id",
      operationId: "get-course-content",
      tags: ["Course"],
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
          name: "course_id",
          schema: {
            type: "string",
          },
          description: "Course's id to be fetched",
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
                  summary: "Course content fetched",
                  value: {
                    success: true,
                    message: "Course content fetched",
                    data: [
                      {
                        videoUrl: "lesson1.mp4",
                        title: "Lesson 1",
                        videoDuration: 530,
                        videoDescription: "This video introduces this course",
                        videoSection: "Basics",
                        links: [
                          {
                            title: "Resources",
                            url: "www.example.com/resources",
                            _id: "xvshshhs83",
                          },
                        ],
                        objectives: [
                          {
                            title: "Introduce the course",
                            _id: "gssghwyu8272",
                          },
                          {
                            title: "Learn the basics",
                            _id: "726dv0bcb",
                          },
                        ],
                        questions: [
                          {
                            user: {
                              avatar: {
                                id: "user-id",
                                url: "user-avatar.png",
                              },
                              _id: "671346148e802b614810fc51",
                              name: "User A",
                              email: "user@example.com",
                              role: "user",
                              isVerified: true,
                              courses: [
                                {
                                  courseId: "xjhdhds98lopd",
                                  progress: [
                                    {
                                      videoId: "alopwb83hd",
                                      viewed: true,
                                      _id: "bche903ndbdb",
                                    },
                                  ],
                                  reviewed: false,
                                  _id: "iuw8eve9892hd",
                                },
                              ],
                            },
                            question: "How long will it take?",
                            _id: "question-id",
                            questionReplies: [
                              {
                                user: {
                                  avatar: {
                                    id: "user-id",
                                    url: "user-avatar.png",
                                  },
                                  _id: "671346148e802b614810fc51",
                                  name: "User A",
                                  email: "user@example.com",
                                  role: "user",
                                  isVerified: true,
                                  courses: [
                                    {
                                      courseId: "xjhdhds98lopd",
                                      progress: [
                                        {
                                          videoId: "alopwb83hd",
                                          viewed: true,
                                          _id: "bche903ndbdb",
                                        },
                                      ],
                                      reviewed: false,
                                      _id: "iuw8eve9892hd",
                                    },
                                  ],
                                },
                                answer: "It is fine",
                                _id: "anser-id",
                                createdAt: "2025-06-06T19:49:44.923+00:00",
                                updatedAt: "2025-06-06T19:49:44.923+00:00",
                              },
                            ],
                            createdAt: "2025-06-06T19:49:44.923+00:00",
                            updatedAt: "2025-06-06T19:49:44.923+00:00",
                          },
                        ],
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
          description: "Restricted",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                restrictedResource: {
                  summary: "Restricted Course",
                  value: {
                    success: false,
                    message: "You are not eligible to access this course.",
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
                    message: "User not found",
                    statusCode: 404,
                  },
                },
                courseNotFound: {
                  summary: "Course not found",
                  value: {
                    success: false,
                    message: "Course not found",
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

export default courseSwagger;
