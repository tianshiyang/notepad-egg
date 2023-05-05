module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: STRING(100), allowNull: false },
    ctime: { type: DATE, allowNull: false },
    avatar: { type: STRING(100), allowNull: false },
    signature: { type: STRING(100), allowNull: false },
    password: { type: STRING(100), allowNull: false },
  }, {
    tableName: 'user', // 直接提供表名
    createdAt: false, // 不想要时间戳
    updatedAt: false,
  });

  return User;
};
