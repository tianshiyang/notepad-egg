/* eslint valid-jsdoc: "off" */

'use strict';

const I18n = require('i18n');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1682518307730_7677';

  // add your middleware config here

  // 全局中间件
  config.middleware = [
    'errorHandler',
  ];

  I18n.configure({
    locales: [ 'zh-CN' ],
    defaultLocale: 'zh-CN',
    directory: __dirname + '/locale',
  });

  // 验证插件
  config.validate = {
    // convert: true,
    // validateRoot: false,
    // 中文转换
    translate() {
      const args = Array.prototype.slice.call(arguments);
      return I18n.__.apply(I18n, args);
    },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: [ '*' ], // 配置白名单
  };

  config.logger = {
    // outputJSON: true,
  };

  // config.mysql = {
  //   client: {
  //     // host
  //     host: 'localhost',
  //     // 端口号
  //     port: '3306',
  //     // 用户名
  //     user: 'root',
  //     // 密码
  //     password: '12345678', // Window 用户如果没有密码，可不填写
  //     // 数据库名
  //     database: 'notepad',
  //   },
  //   // 是否加载到 app 上，默认开启
  //   app: true,
  //   // 是否加载到 agent 上，默认关闭
  //   agent: false,
  // };
  config.sequelize = {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    database: 'notepad',
    password: '12345678',
  };

  // add your user config here 全局配置信息
  const userConfig = {
    // myAppName: 'egg',
    uploadDir: 'app/public/upload',
  };

  config.jwt = {
    secret: 'tianshiyang', // 加密字符串
  };

  config.multipart = {
    mode: 'file',
  };

  config.cors = {
    origin: '*', // 允许所有跨域访问
    credentials: true, // 允许 Cookie 跨域跨域
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  return {
    ...config,
    ...userConfig,
  };
};

