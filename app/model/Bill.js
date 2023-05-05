module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Bill = app.model.define('bill', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    pay_type: { type: INTEGER, allowNull: false },
    amount: { type: INTEGER, allowNull: false },
    date: { type: DATE, allowNull: false },
    type_id: { type: INTEGER, allowNull: false },
    user_id: { type: INTEGER, allowNull: false },
    remark: { type: STRING(100) },
  }, {
    tableName: 'bill', // 直接提供表名
    createdAt: false, // 不想要时间戳
    updatedAt: false,
  });

  return Bill;
};
