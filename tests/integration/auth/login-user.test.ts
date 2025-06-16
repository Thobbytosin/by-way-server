import { createTestApp } from "../../../app-test";
import connectDB from "../../../utils/db";
import disconnectDB from "../../../utils/disconnectDb";
import request from "supertest";

describe("POST /api/v1/login - Login User", () => {
  let appTest: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    appTest = createTestApp();

    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it("1. return 400 error code if request body is empty or no required fields", async () => {
    const res = await request(appTest)
      .post("/api/v1/login")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({ email: "example@ex.com" }); // no password

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Please enter your email and password");
  });

  it("2. return 404 error code if user is not found", async () => {
    const res = await request(appTest)
      .post("/api/v1/login")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({ email: "example@ex.com", password: "ABCD1234" });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Account not found");
  });

  it("3. should not send token if password does not match", async () => {
    const res = await request(appTest)
      .post("/api/v1/login")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({ email: "tobi2@example.com", password: "wrong_password" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should log in the user successfully and save tokens in the cookie", async () => {
    const testUser = {
      email: "tobi2@example.com",
      password: "SecurePass123!",
    };

    const res = await request(appTest)
      .post("/api/v1/login")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send(testUser);

    expect(res.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("access_token="),
        expect.stringContaining("refresh_token="),
        expect.stringContaining("_can_logged_in="),
      ])
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/Logged in successfully/);
  });
});
