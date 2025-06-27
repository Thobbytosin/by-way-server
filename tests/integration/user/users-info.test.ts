import { createTestApp } from "../../../app-test";
import connectDB from "../../../utils/db";
import disconnectDB from "../../../utils/disconnectDb";
import bcryptjs from "bcryptjs";
import User from "../../../models/user.model";
import jwt from "jsonwebtoken";
import request from "supertest";

describe("Users Integration Tests", () => {
  let appTest: any;
  let testUser: any;
  let validAccessToken: string;
  let expiredAccessToken: string;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    appTest = createTestApp();

    await connectDB();

    const hashedPassword = await bcryptjs.hash("Secure123", 10);

    testUser = await User.create({
      name: "Test User",
      email: "testUser@example.com",
      password: hashedPassword,
    });

    validAccessToken = jwt.sign(
      { id: testUser._id },
      process.env.ACCESS_TOKEN_SIGN_IN as string,
      { expiresIn: "59m" }
    );

    expiredAccessToken = jwt.sign(
      { id: testUser._id },
      process.env.ACCESS_TOKEN_SIGN_IN as string,
      { expiresIn: "1ms" }
    );

    // await for some time to
    await new Promise((resolve) => setTimeout(resolve, 10));
  });

  afterAll(async () => {
    await User.deleteOne({ email: "testUser@example.com" });
    await disconnectDB();
  });

  it.skip("1. should return user profile details if token is valid", async () => {
    const res = await request(appTest)
      .get("/api/v1/me")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`access_token=${validAccessToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/User fetched/);
  }, 10000);

  it.skip("2. should return 400 code if there is no token", async () => {
    const res = await request(appTest)
      .get("/api/v1/me")
      .set("x-cookie-consent", JSON.stringify({ accept: true }));

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/Restricted/);
  }, 10000);

  it.skip("3. should return 401 code if token has expired", async () => {
    const res = await request(appTest)
      .get("/api/v1/me")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`access_token=${expiredAccessToken}`]);

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/Session has ended/);
  }, 10000);

  // it("4. should update user info", async()=>{
  //   const res = await request(appTest)
  //     .put("/api/v1/update-user-info")
  //     .set("x-cookie-consent", JSON.stringify({ accept: true }))
  //     .set("Cookie", [`access_token=${validAccessToken}`]);

  // }, 10000)
});
