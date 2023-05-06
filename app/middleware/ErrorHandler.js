module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (e) {
      ctx.logger.error(e);
      ctx.body = {
        message: '服务端错误',
        code: 500,
      };
    }
  };
};
