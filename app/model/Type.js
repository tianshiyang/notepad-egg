module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Type = app.model.define('type', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: INTEGER, allowNull: false },
    name: { type: STRING(100), allowNull: false },
    user_id: { type: INTEGER, allowNull: false },
  }, {
    tableName: 'type', // 直接提供表名
    createdAt: false, // 不想要时间戳
    updatedAt: false,
  });

  return Type;
};
