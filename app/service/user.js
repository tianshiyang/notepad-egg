const Service = require('egg').Service;

class UserService extends Service {
  // 判断当前用户是否存在
  async getUserByName(username) {
    const { ctx } = this;
    try {
      const result = await ctx.model.User.findOne({
        where: {
          username,
        },
      });
      return result;
    } catch (e) {
      return e.sqlMessage;
    }
  }

  // 注册
  async register(params) {
    const { ctx } = this;
    try {
      return await ctx.model.User.create(params);
    } catch (e) {
      return e.sqlMessage;
    }
  }

  // 更改用户信息
  async updateUserInfo(params) {
    const { ctx } = this;
    const { id } = params;
    const options = {
      where: {
        id,
      },
    };
    try {
      const result = await ctx.model.User.update(params, options);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // 修改密码
  async resetPassword({ newPassword, username }) {
    try {
      return await this.ctx.model.User.update({ password: newPassword }, { where: { username } });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = UserService;
