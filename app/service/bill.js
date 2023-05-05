const { Service } = require('egg');
const { Op } = require('sequelize');

class BillService extends Service {
  // 添加账单
  async add(params) {
    try {
      return await this.ctx.model.Bill.create(params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 获取账单
  async getBillList({ format_date, type_id, page_no = 1, page_size = 5, id }) {
    try {
      const where = {
        user_id: id,
      };
      if (type_id) {
        where.type_id = type_id;
      }
      if (format_date) {
        where.date = {
          [ Op.startsWith ]: format_date,
        };
      }

      // 第一步链接两个表
      this.ctx.model.Bill.hasOne(this.ctx.model.Type, { foreignKey: 'id', targetKey: 'type_id' });
      // 第二步查询
      return await this.ctx.model.Bill.findAll({
        attributes: [ 'pay_type', 'amount', 'date', 'remark' ],
        include: [{
          // 第三步：子表的字段
          subQuery: false,
          model: this.ctx.model.Type,
          attributes: [[ 'id', 'type_id' ], [ 'name', 'type_name' ]],
        }],
        where,
        limit: page_no * page_size,
        offset: (page_no - 1) * page_size,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 获取账单详情
  async getBillDetail({ order_id }) {
    try {
      this.ctx.model.Bill.hasOne(this.ctx.model.Type, { foreignKey: 'id', targetKey: 'type_id' });
      return await this.ctx.model.Bill.findAll({
        attributes: [ 'pay_type', 'amount', 'date', 'remark', 'user_id' ],
        include: {
          subQuery: false,
          model: this.ctx.model.Type,
          attributes: [[ 'id', 'type_id' ], [ 'name', 'type_name' ]],
        },
        where: {
          id: order_id,
        },
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 更改账单
  async editBillOrder(params) {
    const { order_id } = params;
    try {
      const result = await this.ctx.model.Bill.update(params, {
        where: {
          id: order_id,
        },
      });
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 删除订单
  async deleteBillOrder(params) {
    try {
      return await this.ctx.model.Bill.destroy({
        where: {
          id: params.order_id,
        },
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 获取收支构成
  async getCostOrIncome({ user_id, pay_type, date }) {
    try {
      const where = {
        user_id,
      };
      if (pay_type !== 'all') {
        where.pay_type = pay_type;
      }
      if (date) {
        where.date = {
          [Op.startsWith]: date,
        };
      }
      this.ctx.model.Bill.hasOne(this.ctx.model.Type, { foreignKey: 'id', targetKey: 'type_id' });
      return await this.ctx.model.Bill.findAll({
        attributes: [ 'pay_type', 'amount', 'date', 'remark' ],
        include: {
          model: this.ctx.model.Type,
          attributes: [[ 'name', 'type_name' ], [ 'id', 'type_id' ]],
        },
        where,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = BillService;
