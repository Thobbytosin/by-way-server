import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
  roots: ["<rootDir>/tests", "<rootDir>/controllers", "<rootDir>/routes"], // Customize as needed
  moduleNameMapper: {
    "^@controllers/(.*)$": "<rootDir>/controllers/$1",
    "^@routes/(.*)$": "<rootDir>/routes/$1",
    "^@utils/(.*)$": "<rootDir>/utils/$1",
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  clearMocks: true,
  verbose: true,
  forceExit: true,
  detectOpenHandles: true,
};

export default config;
