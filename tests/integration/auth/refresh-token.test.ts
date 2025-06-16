import { createTestApp } from "../../../app-test";
import connectDB from "../../../utils/db";
import disconnectDB from "../../../utils/disconnectDb";
import bcryptjs from "bcryptjs";
import User from "../../../models/user.model";
import jwt from "jsonwebtoken";
import request from "supertest";

describe("GET /api/v1/refresh-tokens - Refresh Tokens", () => {
  let appTest: any;
  let testUser: any;
  let validRefreshToken: string;
  let expiredAccessToken: string;
  let expiredRefreshToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    appTest = createTestApp();

    await connectDB();

    const hashedPassword = await bcryptjs.hash("Secure123", 10);

    testUser = await User.create({
      name: "Test Refresh User",
      email: "testRefreshUser@example.com",
      password: hashedPassword,
    });

    validRefreshToken = jwt.sign(
      { id: testUser._id },
      process.env.REFRESH_TOKEN_SIGN_IN as string,
      { expiresIn: "7d" }
    );

    expiredAccessToken = jwt.sign(
      { id: testUser._id },
      process.env.ACCESS_TOKEN_SIGN_IN as string,
      { expiresIn: "1ms" }
    );

    expiredRefreshToken = jwt.sign(
      { id: testUser._id },
      process.env.REFRESH_TOKEN_SIGN_IN as string,
      { expiresIn: "1ms" }
    );

    // await for some time to
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

  afterAll(async () => {
    await User.deleteOne({ email: "testRefreshUser@example.com" });
    await disconnectDB();
  });

  it("1. should generate new tokens and save in the cookies if the refresh token is valid", async () => {
    const res = await request(appTest)
      .get("/api/v1/refresh-tokens")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`access_token=${expiredAccessToken}`])
      .set("Cookie", [`refresh_token=${validRefreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/Tokens Refreshed/);

    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("access_token="),
        expect.stringContaining("refresh_token="),
        expect.stringContaining("_can_logged_in="),
      ])
    );
  }, 10000);

  it("2. should return 400 code if there is no refresh token", async () => {
    const res = await request(appTest)
      .get("/api/v1/refresh-tokens")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`access_token=${expiredAccessToken}`]);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Session has ended/);
  }, 10000);

  it("3. should return 401 code if token has expired", async () => {
    const res = await request(appTest)
      .get("/api/v1/refresh-tokens")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`refresh_token=${expiredRefreshToken}`]);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Session has ended/);
  }, 1000);
});
