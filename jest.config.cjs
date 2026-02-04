const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

module.exports = {
  testEnvironment: "node",

  transform: {
    ...tsJestTransformCfg,
  },

  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "**/__tests__/**/*.spec.ts",
    "**/?(*.)+(spec|test).ts",
  ],

  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
  ],
};
