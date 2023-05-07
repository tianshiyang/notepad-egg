'use strict';
function addUserValidator(app) {
  // 自定义检验器，只能扩展功能
  app.validator.addRule('adminValueValidate', (rule, value) => {
    if (rule.adminValue.includes(value)) {
      return '不能为admin';
    }
  });
}

module.exports = addUserValidator;
