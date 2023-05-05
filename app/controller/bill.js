'use strict';

const { Controller } = require('egg');
const moment = require('moment');

class BillController extends Controller {
  async add() {
    const { ctx, app } = this;

    // 获取参数
    const { amount, type_id, date = moment().format('YYYY-MM-DD HH:mm:ss'), pay_type, remark = '' } = ctx.request.body;

    if (!amount || !type_id) {
      ctx.body = {
        code: 400,
        message: '参数错误',
      };
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

      if (result.affectedRows > 0) {
        ctx.body = {
          code: 200,
          message: '更新成功',
          result,
        };
      } else {
        ctx.body = {
          code: 500,
          message: result.sqlMessage,
        };
      }
    } catch (e) {
      console.log(e);
    }
  }

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
      const result = await ctx.service.bill.getBillList({ format_date, type_id, page_no, page_size, id });
      if (result) {
        ctx.body = {
          code: 200,
          data: result,
        };
      } else {
        ctx.body = {
          code: 400,
          message: '查询错误',
        };
      }
    } catch (e) {
      console.log(e);
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
      const { id } = ctx.query;
      if (!id) {
        ctx.body = {
          code: 400,
          message: '缺少账单ID',
        };
        return;
      }
      const result = await ctx.service.bill.getBillDetail({ user_id: decode.id, order_id: id });
      if (!result) {
        ctx.body = {
          code: 400,
          message: '查询失败',
        };
      } else {
        ctx.body = {
          code: 200,
          data: result,
        };
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  // 编辑账单
  async editBillOrder() {
    try {
      const decode = await this.app.jwt.verify(this.ctx.request.header.authorization, this.app.config.jwt.verify);
      if (!decode) {
        return;
      }
      const { pay_type, amount, date, type_id, remark } = this.ctx.request.body;
      if (!pay_type || !amount || !date || !type_id || !remark) {
        this.ctx.body = {
          code: 400,
          message: '参数错误',
        };
        return;
      }
      const result = await this.ctx.service.bill.editBillOrder({ pay_type, amount, date, type_id, remark, id: decode.id });
      if (!result) {
        this.ctx.body = {
          code: 400,
          message: '更改失败',
        };
      } else {
        this.ctx.body = {
          code: 200,
          message: '更新成功',
          date: result,
        };
      }
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        code: 400,
        message: '更改失败',
      };
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
      const result = await this.ctx.service.bill.deleteBillOrder({ user_id: decode.id, order_id: id });
      if (!result) {
        this.ctx.body = {
          code: 400,
          message: '删除失败',
        };
      } else {
        this.ctx.body = {
          code: 200,
          message: '删除成功',
        };
      }
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        code: 400,
        message: '删除失败',
      };
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
        date: this.ctx.request.body.date,
        user_id: decode.id,
        pay_type: this.ctx.request.body.pay_type ?? 'all',
      };
      const result = await this.ctx.service.bill.getCostOrIncome(params);
      if (!result) {
        this.ctx.body = {
          code: 400,
          message: '获取失败',
        };
      } else {
        const total_amount = result.reduce((count, cur) => {
          count += Number(cur.amount);
          return count;
        }, 0);
        this.ctx.body = {
          list: result,
          total_amount,
        };
      }
    } catch (e) {
      console.log(e);
      this.ctx.body = {
        code: 400,
        message: '获取收支构成失败',
      };
    }
  }
}

module.exports = BillController;
