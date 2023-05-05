const { Service } = require('egg');

class BillService extends Service {
  // 添加账单
  async add(params) {
    const { app } = this;
    try {
      return await app.mysql.insert('bill', params);
    } catch (e) {
      return e;
    }
  }

  // 获取账单
  async getBillList({ format_date, type_id, page_no = 1, page_size = 5, id }) {
    const { app } = this;
    try {
      const sql = `
        SELECT pay_type, amount, date, type_id, remark, name as type_name from bill b, type t
        WHERE 
          b.type_id=t.id AND
          IF (${type_id ?? false}, b.type_id=?, TRUE ) AND
          IF (${format_date ?? false}, DATE_FORMAT(b.date, '%Y-%m')=?, TRUE) AND
          b.user_id=?
        ORDER BY b.date DESC
        LIMIT ?, ?
      `;
      return await app.mysql.query(sql, [ type_id, format_date, id, (page_no - 1) * page_size, page_no * page_size ]);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 获取账单详情
  async getBillDetail({ user_id, order_id }) {
    try {
      const sql = `
        SELECT pay_type, amount, date, type_id, remark, name as type_name from bill b, type t
        WHERE 
          b.type_id = t.id AND
          b.user_id=? AND
          b.id=?
      `;
      return await this.app.mysql.query(sql, [ user_id, order_id ]);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  // 更改账单
  async editBillOrder(params) {
    try {
      return await this.app.mysql.update('bill', params);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 删除订单
  async deleteBillOrder(params) {
    try {
      return await this.app.mysql.delete('bill', {
        id: params.order_id,
        user_id: params.user_id,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // 获取收支构成
  async getCostOrIncome({ user_id, pay_type, date }) {
    try {
      const sql = `
        SELECT  pay_type, amount, date, type_id, remark, name as type_name
        FROM bill b, type t
        WHERE 
        	b.type_id = t.id AND
        	b.user_id=? AND
        	IF (${pay_type !== 'all'}, b.pay_type=?, TRUE ) AND
        	IF (${date ?? false}, DATE_FORMAT(b.date, '%Y-%m')=?, TRUE)
      `;
      return await this.app.mysql.query(sql, [ user_id, pay_type, date ]);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

module.exports = BillService;
