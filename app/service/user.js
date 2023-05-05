const Service = require('egg').Service;

class UserService extends Service {
  // 判断当前用户是否存在
  async getUserByName(username) {
    const { app } = this;
    try {
      const result = await app.mysql.get('user', { username });
      return result;
    } catch (e) {
      return e.sqlMessage;
    }
  }

  // 注册
  async register(params) {
    const { app } = this;
    try {
      await app.mysql.insert('user', params);
      return '注册成功';
    } catch (e) {
      return e.sqlMessage;
    }
  }

  // 更改用户信息
  async updateUserInfo(params) {
    const { app } = this;
    const { id } = params;
    const options = {
      where: {
        id,
      },
    };
    try {
      const result = await app.mysql.update('user', params, options);
      return result.affectedRows === 1;
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

module.exports = UserService;
