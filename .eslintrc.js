module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    env: {
        browser: true,
        node: true,
        es6: true,
        'jest/globals': true,
    },
    plugins: [
        '@typescript-eslint',
        'react',
        'jest'
    ],
    extends: [
        'standard',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        // 'plugin:prettier/recommended',
        // 'eslint-config-prettier', // must be last
        // 'prettier/@typescript-eslint',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/interface-name-prefix': [0, 'always'],
        'jsx-quotes': ['error', 'prefer-double'],
        'no-multi-spaces': 0,
        'no-useless-constructor': 0,
        'react/no-unescaped-entities': 0,
        'react/prop-types': 0,
        'space-before-function-paren': 0,

        // SOURCE: https://github.com/cats-oss/eslint-config-abema/blob/master/config/eslintrc_typescript.js
        // Basically, it's nice to uniform the order of overload signatures.
        '@typescript-eslint/adjacent-overload-signatures': 'warn',

        // TypeScript allows both forms of `[]` and `Array<T>`.
        // But typescript compiler also supports `ReadonlyArray<T>` builtin type and others.
        // So I seem it's nice to sort with `Array<T>` to decrease impedance mismatch.
        '@typescript-eslint/array-type': ['warn', 'generic'],

        // We cannot define this. User project should enable this.
        '@typescript-eslint/ban-types': 'off',

        // `@ts-ignore` violates all static type checkings for _all expressions_ in the next line.
        // It will not be too much warn about it.
        '@typescript-eslint/ban-ts-ignore': 'error',

        // This should be sorted with ESLint builtin rule.
        'camelcase': 'off',
        '@typescript-eslint/camelcase': ['error', {
            'properties': 'always',
            'ignoreDestructuring': false,
        }],

        // A class & interface should be PascalCased
        '@typescript-eslint/class-name-casing': 'error',

        // TODO: (#64) @typescript-eslint/explicit-function-return-type

        // It's redundant to enforce to supply `public`.
        '@typescript-eslint/explicit-member-accessibility': 'off',

        // TODO: @typescript-eslint/generic-type-naming
        // TODO: @typescript-eslint/indent

        // Sort with the preferred style (`;`) in TypeScript world.
        '@typescript-eslint/member-delimiter-style': ['warn', {
            'multiline': {
                'delimiter': 'semi',
                'requireLast': true,
            },
            'singleline': {
                'delimiter': 'semi',
                'requireLast': true,
            }
        }],

        // By these reasons, I think we recommend to add `_` prefix to private fields.
        //
        //  * Historically, JavaScript wolrd use `_` prefix to mark fields as _private_.
        //  * Until coming [private fields of class field declarations proposal](https://github.com/tc39/proposal-class-fields),
        //    there is no true private fields in JavaScript.
        //      * If TypeScript compiler supports it, it might be better to relax this rule.
        //  * TypeScript will be transformed into plain JavaScript and plain JavaScript does not any informations
        //    to express whether a field is private or not.
        '@typescript-eslint/member-naming': ['warn', {
            'private': '^_',
            'protected': '^_',
        }],

        // I don't think it's not efffective to sort the order by public/private/protected.
        '@typescript-eslint/member-ordering': ['warn', {
            // * I'd like to aggregate instance fields
            //   to know what we should initialize in the constructor to stabilize the object shape.
            // * It's the time to refactor the object if we'd like to mix the order of static fields & methods.
            'default': [
                'static-field',
                'static-method',
                'instance-field',
                'constructor',
                'instance-method',
            ],
        }],

        // Sort the style in both of ts and tsx.
        '@typescript-eslint/no-angle-bracket-type-assertion': 'error',

        // This should be sorted with ESLint builtin rule.
        'no-array-constructor': 'off',
        '@typescript-eslint/no-array-constructor': 'error',

        // It works as a marker that to implement some interfaces.
        '@typescript-eslint/no-empty-interface': 'off',

        // TODO: (#63) @typescript-eslint/no-extraneous-class

        // This is common pitfalls for beginners. We must ban.
        '@typescript-eslint/no-for-in-array': 'error',

        // Type inference is useful feature for Gradual Typing and other static typing system.
        // However, over omission would increases compile (type checking) time and
        // lacks the aspect of type annotation benefits as _documentation_.
        '@typescript-eslint/no-inferrable-types': 'off',

        // Ban the misused style aggressively
        '@typescript-eslint/no-misused-new': 'error',

        // Only allow declarations. Use ES Module in almost projects.
        '@typescript-eslint/no-namespace': ['error', {
            'allowDeclarations': true,
            'allowDefinitionFiles': true,
        }],

        // Please opt-out this rule if you don't have any workarounds.
        '@typescript-eslint/no-non-null-assertion': 'warn',

        // Uniform the style.
        '@typescript-eslint/no-object-literal-type-assertion': 'warn',

        // This TypeScript syntax is useful to reduce declarations of class properties.
        // However, we feel this syntax has these negative points:
        //
        //  * This is not a part of ECMA262 standards.
        //  * This makes the ordering of initializing members unclear.
        //
        // By these things, we enable this rule as defensive choice.
        '@typescript-eslint/no-parameter-properties': 'error',

        // Today, we should use ES Module import in general (almost) case.
        '@typescript-eslint/no-require-imports': 'error',

        // Use arrow function basically.
        '@typescript-eslint/no-this-alias': ['warn', {
            'allowDestructuring': false,
            'allowedNames': ['self'],
        }],

        // Basically, use ES Module import. // <reference path="" /> is just special case.
        '@typescript-eslint/no-triple-slash-reference': 'error',

        // Disabling this does not make sense completely.
        '@typescript-eslint/no-type-alias': 'off',

        // TODO: @typescript-eslint/no-unnecessary-qualifier
        // TODO: @typescript-eslint/no-unnecessary-type-assertion

        // This should be sorted with ESLint builtin rule.
        //
        // If your project only has TypeScript or you run ESLint for TypeScript separately from for JavaScript,
        // and if you use typescript compiler with `noUnused***` options,
        // then you can disable this.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', {
            'vars': 'all',
            'args': 'after-used',
            'argsIgnorePattern': '^_', // Sort with TypeScript compiler's builtin linter.
            'caughtErrors': 'all',
            'caughtErrorsIgnorePattern': '^_', // Allow `catch (_e) {...}`
        }],

        // This should be sorted with ESLint builtin rule.
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', {
            'functions': false, //  Function declarations are hoisted.
            'classes': true, // Class declarations are not hoisted. We should warn it.
            'variables': true, // for Temporary Dead Zone.
            'typedefs': true, // We rely TypeScript compiler.
        }],

        // We should sort with builtin rule.
        '@typescript-eslint/no-useless-constructor': 'off',

        // I seem almost user would use simple function type.
        // A person who uses an interface to express callbable signature is
        // know what they are doing.
        '@typescript-eslint/prefer-function-type': 'error',

        // Each style has its own pros & cons.
        '@typescript-eslint/prefer-interface': 'off',

        // This bans legacy syntax.
        '@typescript-eslint/prefer-namespace-keyword': 'error',

        // Of course, It looks nice for styling to sort them
        // to async function that all functions returning `Promise`.
        // However, we hesitate to say some policy about it by these reasons
        // and we stay disable this rule.
        //
        //  1. We don't have much data about the performance impact of
        //     "async function vs returning `Promise`".
        //  2. In almost case, it bloats the result code size by down-level transform for async function.
        //     even if it simply return the value wrapped in `Promise` and without any `await` clause.
        //     if is not always nice to use `async function()`.
        //  3. We can annotate the type of returned value and we also checking types statically,
        //     thus we don't have strong motivation to use `async function ()` syntax as signature.
        //
        // For the future, we might be enable this. But this moment is not so.
        '@typescript-eslint/promise-function-async': 'off',
    },
    settings: {
        react: {
            version: 'detect',
        },
        linkComponents: [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            'Hyperlink',
            { name: 'Link', linkAttribute: 'to' },
        ],
    },
};
