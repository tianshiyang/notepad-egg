'use strict';

const BaseController = require('./baseController');
const moment = require('moment');
const { parseQuery } = require('../utils/resultParse');

class BillController extends BaseController {
  // 新增账单
  async add() {
    const { ctx, app } = this;

    // 获取参数
    const { amount, type_id, date = moment().format('YYYY-MM-DD HH:mm:ss'), pay_type, remark = '' } = ctx.request.body;

    const rules = {
      amount: 'string',
      type_id: 'string',
      pay_type: 'string',
    };

    const errors = this.app.validator.validate(rules, ctx.request.body);
    if (errors) {
      this.error({
        message: `${errors[0].field}: ${errors[0].message}`,
      });
      return;
    }

    try {
      const decode = await app.jwt.verify(ctx.request.header.authorization, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const user_id = decode.id;
      const result = await ctx.service.bill.add({
        user_id,
        amount,
        type_id,
        date,
        pay_type,
        remark,
      });

      if (result) {
        this.success({
          message: '新增成功',
          data: result,
        });
      } else {
        this.error({
          message: '新增失败',
        });
      }
    } catch (e) {
      this.error({
        message: e,
      });
    }
  }

  // 获取账单列表
  async getBillList() {
    const { ctx, app } = this;
    const { date, type_id, page_no, page_size } = ctx.query;
    const format_date = date ? moment(date).format('YYYY-MM') : date;

    try {
      const decode = app.jwt.verify(ctx.request.header.authorization, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const id = decode.id;
      const data = await ctx.service.bill.getBillList({ format_date, type_id, page_no, page_size, id });
      if (data) {
        this.success({
          data,
        });
      } else {
        this.error({
          message: '查询错误',
        });
      }
    } catch (e) {
      this.error({
        message: e,
      });
    }
  }

  // 获取订单详情
  async getBillDetail() {
    const { ctx, app } = this;
    try {
      const decode = await app.jwt.verify(ctx.request.header.authorization, app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const { id: order_id } = ctx.query;

      const rules = {
        id: 'string',
      };

      const errors = this.app.validator.validate(rules, ctx.request.body);
      if (errors) {
        this.error({
          message: `${errors[0].field}: ${errors[0].message}`,
        });
        return;
      }
      const data = await ctx.service.bill.getBillDetail({ order_id });
      if (!data) {
        this.error({
          message: '查询失败',
        });
      } else {
        this.success({
          data,
        });
      }
    } catch (e) {
      this.error({
        message: e,
      });
    }
  }

  // 编辑账单
  async editBillOrder() {
    try {
      const decode = await this.app.jwt.verify(this.ctx.request.header.authorization, this.app.config.jwt.verify);
      if (!decode) {
        return;
      }
      const { pay_type, amount, date, type_id, remark, order_id } = this.ctx.request.body;

      const rules = {
        pay_type: [ '1', '2' ],
        amount: 'string',
        date: 'date',
        type_id: 'string',
        remark: 'string',
        order_id: 'string',
      };
      const errors = this.app.validator.validate(rules, this.ctx.request.body);
      if (errors) {
        this.error({
          message: `${errors[0].field}: ${errors[0].message}`,
        });
        return;
      }

      const data = await this.ctx.service.bill.editBillOrder({ pay_type, amount, date, type_id, remark, order_id });
      if (!data) {
        this.error({
          message: '更改失败',
        });
      } else {
        this.success({
          data,
        });
      }
    } catch (e) {
      this.error({
        message: '更改失败',
      });
    }
  }

  // 删除订单
  async deleteBillOrder() {
    try {
      const decode = await this.app.jwt.verify(this.ctx.request.header.authorization, this.app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const { id } = this.ctx.request.body;
      const user_id = parseQuery(await this.ctx.service.bill.getBillDetail({ order_id: id }))[0].user_id;
      if (user_id !== id) {
        this.error({
          message: '不可更改其他人账单',
        });
        return;
      }
      const result = await this.ctx.service.bill.deleteBillOrder({ user_id: decode.id, order_id: id });
      if (!result) {
        this.error({
          message: '删除失败',
        });
      } else {
        this.success({
          message: '删除成功',
        });
      }
    } catch (e) {
      this.error({
        message: '删除失败',
      });
    }
  }

  // 获取收支构成
  async getCostOrIncome() {
    try {
      const decode = await this.app.jwt.verify(this.ctx.request.header.authorization, this.app.config.jwt.secret);
      if (!decode) {
        return;
      }
      const params = {
        date: this.ctx.query.date,
        user_id: decode.id,
        pay_type: this.ctx.query.pay_type ?? 'all',
      };
      const result = await this.ctx.service.bill.getCostOrIncome(params);
      if (!result) {
        this.error({
          message: '获取失败',
        });
      } else {
        const total_amount = result.reduce((count, cur) => {
          count += Number(cur.amount);
          return count;
        }, 0);
        const data = {
          total_amount,
          list: result,
        };
        this.success({
          data,
        });
      }
    } catch (e) {
      this.error({
        message: '获取收支构成失败',
      });
    }
  }
}

module.exports = BillController;
