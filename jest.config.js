module.exports = {
    testEnvironment: 'node',
    transform: {
        "^.+\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        '<rootDir>/**/__tests__/**/*.test.ts?(x)'
    ],
    collectCoverageFrom: [
        '**/src/**/*.{ts,tsx}',
        '!**/node_modules/**',
        '!**/__tests__/**',
        '!**/__mocks__/**'
    ],
    coverageDirectory: './__coverage__',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    // moduleNameMapper: {
    //     "@app(.*)$": "<rootDir>/packages/app/src/$1",
    //     "@cli(.*)$": "<rootDir>/packages/cli/src/$1",
    //     "@core(.*)$": "<rootDir>/packages/core/src/$1",
    //     "@logger(.*)$": "<rootDir>/packages/logger/src/$1",
    //     "@model(.*)$": "<rootDir>/packages/model/src/$1",
    //     "@router(.*)$": "<rootDir>/packages/router/src/$1"
    // },
    globals: {
        "ts-jest": {
            "diagnostics": {
                warnOnly: true
            }
        }
    }
}
