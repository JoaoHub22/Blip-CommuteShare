module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended'
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname
    },
    ignorePatterns: ['dist', 'build', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh', '@typescript-eslint', 'jsx-a11y', 'prettier', 'react-hooks'],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'no-console': [
            'error',
            {
                allow: ['warn', 'error', 'info']
            }
        ],
        'no-unused-vars': 'off',
        'import/no-unresolved': 'off',
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        '@typescript-eslint/no-unused-vars': ['error'],
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'jest/no-done-callback': 'off',
        'linebreak-style': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-filename-extension': [
            1,
            {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        ],
        'newline-before-return': 'error',
        'newline-after-var': ['error', 'always'],
        'prettier/prettier': [
            'error',
            {
                endOfLine: 'auto'
            }
        ],
        'import/order': [
            'error',
            {
                groups: ['external', 'builtin', 'internal', 'sibling', 'parent', 'index'],
                pathGroups: [
                    {
                        pattern: '{.,..}/**/*.{,s}css',
                        group: 'object',
                        position: 'after'
                    }
                ],
                warnOnUnassignedImports: true,
                'newlines-between': 'always'
            }
        ]
    }
};
