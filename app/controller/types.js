'use strict';

const BaseController = require('./baseController');
const { parseQuery } = require('../utils/resultParse');

class Type extends BaseController {
  async getTypes() {
    const { id: user_id } = await this.app.jwt.verify(this.ctx.request.header.authorization, this.app.config.security);
    const data = parseQuery(await this.ctx.service.type.getTypes({ user_id }));
    if (data) {
      this.success({
        data,
      });
    } else {
      this.error({
        message: data,
      });
    }
  }
}

module.exports = Type;
