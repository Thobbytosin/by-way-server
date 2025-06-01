class ApiResponse {
  constructor(
    public success: boolean,
    public message: string,
    public data?: any,
    public statusCode?: number
  ) {}

  static success({
    message = "Request successful",
    data = null,
    statusCode = 200,
  }: {
    message?: string;
    data?: any;
    statusCode?: number;
  }) {
    return new ApiResponse(true, message, data, statusCode);
  }

  static error({
    message = "Request failed",
    statusCode = 500,
  }: {
    message?: string;
    statusCode?: number;
  }) {
    return new ApiResponse(false, message, null, statusCode);
  }
}

export default ApiResponse;
