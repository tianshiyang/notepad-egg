'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;

  const _jwt = middleware.jwtErr(app.config.jwt.secret);


  router.get('/', controller.home.index);
  // 注册
  router.post('/user/register', controller.user.register);
  // 登录
  router.post('/user/login', controller.user.login);
  // 测试解码token
  router.post('/user/test-decode', _jwt, controller.user.testDecode);
  // 获取用户信息
  router.get('/user/get/userinfo', _jwt, controller.user.getUserInfo);
  // 修改用户信息
  router.post('/user/update/userinfo', _jwt, controller.user.updateUserInfo);
  // 上传图片
  router.post('/api/upload', controller.upload.upload);
  // 增加账单
  router.post('/bill/add', _jwt, controller.bill.add);
  // 获取账单
  router.get('/bill/get/list', _jwt, controller.bill.getBillList);
  // 获取账单详情
  router.get('/bill/get/detail', _jwt, controller.bill.getBillDetail);
  // 更改账单
  router.post('/bill/edit/order', controller.bill.editBillOrder);
  // 删除订单
  router.post('/bill/delete/order', _jwt, controller.bill.deleteBillOrder);
  // 消费构成
  router.get('/bill/get/cost_or_income', _jwt, controller.bill.getCostOrIncome);
};
