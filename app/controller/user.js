'use strict';

const BaseController = require('./baseController');

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png';
const defaultSignature = '这个人很懒,什么都有留下~';

class UserController extends BaseController {
  // 注册
  async register() {
    const { ctx } = this;
    const { username, password, signature, avatar } = ctx.request.body;
    const rules = {
      username: {
        type: 'adminValueValidate',
        required: true,
        adminValue: [ 'admin' ],
      },
      password: 'password',
      signature: 'string?',
      avatar: 'string?',
    };

    const errors = this.app.validator.validate(rules, ctx.request.body);

    if (errors) {
      this.error({
        message: `${errors[0].field}: ${errors[0].message}`,
      });
      return;
    }

    const userInfo = await ctx.service.user.getUserByName(username);
    // 如果当前用户存在
    if (userInfo && userInfo.id) {
      this.error({
        message: '账户名已被注册，请重新输入',
      });
      return;
    }
    if (userInfo && password !== userInfo.password) {
      this.error({
        message: '用户名或密码错误',
      });
      return;
    }

    // 注册
    const result = await ctx.service.user.register(
      {
        username,
        password,
        signature: signature ?? defaultSignature,
        avatar: avatar ?? defaultAvatar,
        ctime: new Date().getTime(),
      }
    );

    if (result.id) {
      this.success({
        data: result,
      });
    } else {
      this.error({
        message: '注册失败',
      });
    }
  }

  async login() {
    const { ctx, app } = this;
    const rules = {
      username: 'string',
      password: 'password',
    };

    // 校验参数
    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) {
      this.error({
        message: `${errors[0].field}: ${errors[0].message}`,
      });
      return;
    }

    const { username } = this.ctx.request.body;

    const userInfo = await ctx.service.user.getUserByName(username);
    if (!userInfo) {
      this.error({
        message: '用户不存在',
      });
      return;
    }
    const token = app.jwt.sign({
      id: userInfo.id,
      username,
      exp: Math.floor((Date.now() / 1000) + 24 * 60 * 60),
    }, app.config.jwt.secret);

    this.success({
      message: '登录成功',
      data: {
        token,
      },
    });
  }

  // 测试token解码
  async testDecode() {
    const { ctx, app } = this;
    const token = ctx.request.header.authorization;
    const decode = app.jwt.verify(token, app.config.jwt.secret);
    ctx.body = {
      code: 200,
      data: {
        decode,
      },
    };
    return;
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx, app } = this;
    const { username } = await app.jwt.verify(ctx.request.header.authorization, app.config.jwt.secret);
    const userInfo = await ctx.service.user.getUserByName(username);
    this.success({
      data: userInfo,
    });
  }

  // 更新用户信息
  async updateUserInfo() {
    const { ctx, app } = this;
    const { username, id } = await app.jwt.verify(ctx.request.header.authorization, app.config.jwt.secret);
    const { signature = '', avatar = '' } = ctx.request.body;
    const userInfo = await ctx.service.user.getUserByName(username);
    const result = await ctx.service.user.updateUserInfo({ ...userInfo, id, signature, avatar });
    if (result) {
      this.success({
        message: '修改成功',
      });
    } else {
      this.error({
        message: '修改失败',
      });
    }
  }
}

module.exports = UserController;
