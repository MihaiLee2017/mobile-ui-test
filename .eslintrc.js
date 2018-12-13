// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential', 
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'block-spacing': 0,
    'block-scoped-var': 0,                                     // 把 var 语句看作是在块级作用域范围之内
    'comma-dangle': 0,                                         // 不对数组或对象末尾逗号做强制要求
    'curly': 1,                                                // 语句强制分号结尾//为所有控制语句指定花括号约定，警告
    "semi": [1, "never"],                                      // 禁止在语句末尾使用分号 (除了消除以 [、(、/、+ 或 - 开始的语句的歧义)
    'eol-last': 0,                                             // 强制文件最后一行为空行，关闭
    'eqeqeq': [0, 'allow-null'],                               // 要求使用 === 和 !==，但允许 == null
    'dot-notation': 0,                                         // 尽可能的使用点符号
    'no-console': 0,                                           // 不允许存在 console。关闭
    'spaced-comment':1,                                        // 注释空格
    'no-empty': 1,                                             // 空的代码块
    'no-multi-spaces': 1,                                      // 不允许多个空格
    'no-self-compare': 1,                                      // 禁止自身比较
    'no-unused-vars': 1,                                      // 提醒有变量引入未使用
    'no-shadow': 1,                                            // 不允许声明在外层作用域下已声明过的变量
    'no-undef': 2,                                             // 不允许使用未申明变量
    'no-underscore-dangle': 0,                                 // 禁止标识符中有悬空下划线。关闭
    'no-unused-expressions': [1, { allowShortCircuit: true }], // 禁止在语句的位置使用表达式，但允许a && a()
    // 'no-unused-vars': [1, { 'vars': 'all', 'args': 'none' }],  // 变量定义后未使用
    'no-use-before-define': 2,                                 // 不允许在变量定义之前使用它们
    'quotes': [1, 'single', 'avoid-escape'],                    // 使用单引号，除非为了避免转义
    'no-new': 0,
    'no-debugger': 0,                                         // 可以进行debugger
    'space-in-parens': [0, "never"],                         // 单前面有空格不报错
    'no-multi-spaces': 0,                                     // 是否多空格
    'indent': 0,                                            // 空格多少
    'space-before-function-paren': 0,
    'no-useless-escape': 0,
    'no-multiple-empty-lines': 0,                                // 多行空行
    'no-trailing-spaces': 0,                                   // template空行
    'space-before-blocks': 0,                                   // 块语句开始不需要空格
    'camelcase': 0,                                             // 强制驼峰法命名
  }
}