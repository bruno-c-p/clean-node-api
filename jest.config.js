/** @type {import('jest').Config} */
const config = {
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  collectCoverage: true,
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/**",
    "!<rootDir>/src/**/*-protocols.ts",
    "!<rootDir>/src/**/protocols/**",
  ],
  preset: "@shelf/jest-mongodb",
}

module.exports = config
