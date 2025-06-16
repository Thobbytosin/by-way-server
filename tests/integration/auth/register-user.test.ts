import { createTestApp } from "../../../app-test";
import connectDB from "../../../utils/db";
import disconnectDB from "../../../utils/disconnectDb";
import sendMail from "../../../utils/sendMail";
import request from "supertest";
import jwt, { Secret } from "jsonwebtoken";
import User, { IUser } from "../../../models/user.model";

// mock send mail - (export default)
jest.mock("../../../utils/sendMail", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("POST Register and Activate User", () => {
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
      .post("/api/v1/registration")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("2. return 400 error code if email is not valid", async () => {
    const res = await request(appTest)
      .post("/api/v1/registration")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({ name: "Wale", email: "walex", password: "usdgg" });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Please enter a valid email");
  });

  it("3. return 400 error code if password is weak", async () => {
    const res = await request(appTest)
      .post("/api/v1/registration")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({ name: "Wale", email: "test@ex.com", password: "usdg" });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Password security is too weak");
  });

  it("4. return 400 error code if user exists", async () => {
    const res = await request(appTest)
      .post("/api/v1/registration")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send({
        name: "Tobi",
        email: "tobi@example.com",
        password: "SecurePass123!",
      }); // use an existing email in the db

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toBe("Email already exists");
  });

  it("5. should register the user and activate the user - (full flow)", async () => {
    (sendMail as jest.Mock).mockResolvedValueOnce(true);

    const testUser = {
      name: "Tobi2",
      email: "tobi2@example.com",
      password: "SecurePass123!",
    };

    // 1. Send activation code r
    const registrationRes = await request(appTest)
      .post("/api/v1/registration")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .send(testUser);

    expect(registrationRes.status).toBe(200);
    expect(registrationRes.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining(
          "An activation token has been sent to your email"
        ),
        data: null,
        statusCode: 200,
      })
    );

    expect(registrationRes.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("activation_Token=")])
    );

    // 2. get activation token
    const cookies = registrationRes.headers["set-cookie"] as any;
    const activationTokenCookie = cookies.find((cookie: string) =>
      cookie.startsWith("activation_Token")
    );

    expect(activationTokenCookie).toBeDefined();

    const token = activationTokenCookie.split(";")[0].split("=")[1];

    // decode token to get activation code
    const decoded = jwt.verify(
      token,
      process.env.ACTIVATION_SECRET as Secret
    ) as { user: IUser; activationCode: string };

    const activationCode = decoded.activationCode;

    expect(activationCode).toBeDefined();

    // 3. activate user
    const activationRes = await request(appTest)
      .post("/api/v1/activate-user")
      .set("x-cookie-consent", JSON.stringify({ accept: true }))
      .set("Cookie", [`activation_Token=${token}`])
      .send({ activationCode });

    expect(activationRes.status).toBe(201);
    expect(activationRes.body).toEqual(
      expect.objectContaining({
        success: true,
        message: expect.stringContaining("Account registered"),
        data: null,
        statusCode: 201,
      })
    );

    // 4. check for user in the db
    const userInDB = await User.findOne({ email: testUser.email });
    expect(userInDB).not.toBeNull();
    expect(userInDB?.isVerified)?.toBe(true);
  }, 10000);
});
