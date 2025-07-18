const cookieAuth = {
  type: "apiKey",
  in: "cookie",
  name: "access_token",
  description: "JWT access token stored in cookies",
};
const cookieRefresh = {
  type: "apiKey",
  in: "cookie",
  name: "refresh_token",
  description: "JWT refresh token stored in cookies",
};
const cookieVerification = {
  type: "apiKey",
  in: "cookie",
  name: "verification_token",
  description: "JWT verification token stored in cookies",
};

export { cookieAuth, cookieRefresh, cookieVerification };
