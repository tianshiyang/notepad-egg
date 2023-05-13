'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  // 身份认证
  const _jwt = middleware.jwtErr(app.config.jwt.secret);


  // 注册
  router.post('/api/user/register', controller.user.register);
  // 登录
  router.post('/api/user/login', controller.user.login);
  // 测试解码token
  router.post('/api/user/test-decode', _jwt, controller.user.testDecode);
  // 获取用户信息
  router.get('/api/user/get/userinfo', _jwt, controller.user.getUserInfo);
  // 修改用户信息
  router.post('/api/user/update/userinfo', _jwt, controller.user.updateUserInfo);
  // 修改密码
  router.post('/api/user/reset/password', _jwt, controller.user.resetPassword);
  // 上传图片
  router.post('/api/upload', controller.upload.upload);
  // 增加账单
  router.post('/api/bill/add', _jwt, controller.bill.add);
  // 获取账单
  router.get('/api/bill/get/list', _jwt, controller.bill.getBillList);
  // 获取账单详情
  router.get('/api/bill/get/detail', _jwt, controller.bill.getBillDetail);
  // 更改账单
  router.post('/api/bill/edit/order', controller.bill.editBillOrder);
  // 删除订单
  router.post('/api/bill/delete/order', _jwt, controller.bill.deleteBillOrder);
  // 消费构成
  router.get('/api/bill/get/cost_or_income', _jwt, controller.bill.getCostOrIncome);
  // 消费类型
  router.get('/api/type/get/types', _jwt, controller.types.getTypes);
};
