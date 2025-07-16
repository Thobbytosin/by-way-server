import paths from "../docs";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "ByWay E-Learning API",
    version: "1.0.0",
    description:
      "API for an online e-learning platform where people can have access to resources for learning.",
    contact: {
      name: "ByWay Team",
      email: "support@byway.com",
      url: "https://edu-learning-liard.vercel.app/",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: isProduction
        ? process.env.PRODUCTION_SERVER_URL
        : process.env.LOCAL_SERVER_URL,
      description: isProduction
        ? "Version 1.0 Production Server"
        : "Version 1.0 Development Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description: "JWT access token stored in cookies",
      },
      cookieRefresh: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
        description: "JWT refresh token stored in cookies",
      },
      cookieVerification: {
        type: "apiKey",
        in: "cookie",
        name: "verification_token",
        description: "JWT verification token stored in cookies",
      },
    },
    schemas: {
      SuccessResponse: {
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
            example: "Describe ",
          },
          statusCode: {
            type: "number",
            example: "Error status code",
          },
        },
      },
      ErrorResponse: {
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
      },
      UserSignup: {
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
      },
      AccountVerfification: {
        type: "object",
        required: ["verificationCode"],
        properties: {
          verificationCode: {
            type: "string",
            example: "000000",
          },
        },
      },
    },
    responses: {
      InternalServerError: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse",
            },
            example: {
              success: false,
              message: "Something went wrong. Please try again later.",
            },
          },
        },
      },
    },
  },
  paths,
};

export default swaggerConfig;
