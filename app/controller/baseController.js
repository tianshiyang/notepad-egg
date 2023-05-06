const { Controller } = require('egg');
class BaseController extends Controller {
  // 请求成功的返回
  success({ data = {}, code = 200 }) {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      data,
      code,
    };
  }

  // 请求失败的返回
  error({ message = '请求失败', code = 500 }) {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      message,
      code,
    };
  }

  // 没有权限
  noAuthority() {
    const { ctx } = this;
    ctx.status = 200;
    ctx.body = {
      code: 401,
      message: '您无此操作的权限',
    };
  }
}

module.exports = BaseController;
