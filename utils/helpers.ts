import jwt, { Secret } from "jsonwebtoken";

export function add(a: number, b: number) {
  const answer = a + b;

  return answer;
}

export const isEmailValid: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function isPasswordStrong(password: string) {
  const passwordLength = password.trim().length;
  const hasAlphabet = () => !!password.match(/[a-zA-Z]/);
  const hasNumber = () => !!password.match(/[0-9]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasNumber() && hasAlphabet() && passwordLength >= 8;

  return passwordIsArbitrarilyStrongEnough;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

// function to create an activation token and activation code
export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  // activation token to be used for email activation
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );

  return { token, activationCode };
};

function formatTimestamp(ms: number): string {
  const date = new Date(ms);
  console.log(date.toLocaleString()); // e.g., "6/16/2025, 4:12:58 AM"
  console.log(new Date(ms).getTime() - Date.now() < 5 * 60 * 1000);
  return "";
}

// formatTimestamp(1750082796925);
