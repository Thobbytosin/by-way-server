export const internalServerError = {
  description: "Internal Server Error",
  content: {
    "application/json": {
      schema: {
        $ref: "#/components/schemas/ErrorResponse",
      },
      example: {
        success: false,
        message: "Internal server error. Please try again",
        statusCode: 500,
      },
    },
  },
};
