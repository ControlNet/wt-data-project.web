module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@vue/eslint-config-typescript'
    ],
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: [
        'vue'
    ],
    rules: {
        "vue/html-indent": ["error", 4],
        "vue/script-indent": ["error", 4],
        "vue/html-closing-bracket-spacing": ["error", {
            "selfClosingTag": "always",
        }],
        "vue/max-attributes-per-line": ["error", {
            "singleline": 8
        }],
    }
}
