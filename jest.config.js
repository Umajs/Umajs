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
    moduleNameMapper: {
        "^@umajs/core(.*)$": "<rootDir>/packages/core/src$1",
        "^@umajs/router(.*)$": "<rootDir>/packages/router/src$1",
        "^@umajs/app(.*)$": "<rootDir>/packages/app/src$1",
        "^@umajs/cli(.*)$": "<rootDir>/packages/cli/src$1",
        "^@umajs/arg-decorator(.*)$": "<rootDir>/packages/arg-decorator/src$1",
        "^@umajs/plugin-i18n(.*)$": "<rootDir>/packages/plugin-i18n/src$1",
        "^@umajs/plugin-session(.*)$": "<rootDir>/packages/plugin-session/src$1",
        "^@umajs/plugin-static(.*)$": "<rootDir>/packages/plugin-static/src$1",
        "^@umajs/plugin-status(.*)$": "<rootDir>/packages/plugin-status/src$1",
        "^@umajs/plugin-views(.*)$": "<rootDir>/packages/plugin-views/src$1"
    },
    transform: {
        "^.+\.(ts|tsx)$": ["ts-jest", {
            diagnostics: {
                warnOnly: true
            }
        }]
    },
    globals: {
    }
}
