const { Service } = require('egg');
const { Op } = require('sequelize');

class BillService extends Service {
  async getTypes({ user_id, pay_type }) {
    try {
      const where = {
        user_id: {
          [Op.or]: [ 0, user_id ],
        },
      };
      if (pay_type) {
        where.type = pay_type;
      }
      return await this.ctx.model.Type.findAll({
        attributes: [[ 'name', 'pay_type_name' ], 'type', [ 'id', 'pay_type_id' ]],
        where,
      });
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }
}

module.exports = BillService;
