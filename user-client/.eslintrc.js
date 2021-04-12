module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: ['plugin:vue/recommended', '@vue/airbnb'],
    parserOptions: {
      parser: 'babel-eslint',
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  
      semi: ['error', 'never'],
      'max-len': 'off',
      'linebreak-style': 'off',
      camelcase: ['error', { properties: 'never', ignoreDestructuring: true, ignoreImports: true }],
      'arrow-parens': ['error', 'as-needed'],
      'vue/multiline-html-element-content-newline': 'off',
      'comma-dangle': 'off',
      'vue/html-indent': 'off',
      'eol-last': 'off',
      'vue/no-unused-components': 'off',
      'indent': 'off',
      'vue/max-attributes-per-line': 'off',
      'semi': 'off',
      'quotes': 'off',
      'no-plusplus': 'off',
      'quote-props': 'off',
      'no-unneeded-ternary': 'off',
      'no-unused-vars': 'off',
      'prefer-destructuring': 'off',
      'import/first': 'off',
      'no-lonely-if': 'off',
      'object-shorthand': 'off',
      'import/prefer-default-export': 'off',
      'arrow-body-style': 'off'
    },
  }
  