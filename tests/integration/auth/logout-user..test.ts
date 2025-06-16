import request from "supertest";
import { createTestApp } from "../../../app-test";
import connectDB from "../../../utils/db";
import disconnectDB from "../../../utils/disconnectDb";

describe("POST /api/v1/logout - Logout User", () => {
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

  it("should clear all auth cookies and return logout success", async () => {
    const res = await request(appTest)
      .post("/api/v1/logout")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [
        "access_token=abc123",
        "refresh_token=xyz456",
        "_can_logged_in=true",
      ]);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logout successful");

    const setCookies = res.headers["set-cookie"];

    expect(setCookies).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^access_token=;/),
        expect.stringMatching(/^refresh_token=;/),
        expect.stringMatching(/^_can_logged_in=;/),
      ])
    );
  });
});
