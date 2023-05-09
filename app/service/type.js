const { Service } = require('egg');
const { Op } = require('sequelize');

class BillService extends Service {
  async getTypes({ user_id }) {
    try {
      const where = {
        user_id: {
          [Op.or]: [ 0, user_id ],
        },
      };
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
