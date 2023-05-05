'use strict';

const { Controller } = require('egg');
const fs = require('fs');
const moment = require('moment');
const { mkdirp } = require('mkdirp');
const path = require('path');

class UploadController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files?.[0];
    if (!file) {
      ctx.body = {
        code: 500,
        message: '请上传图片',
      };
      return;
    }

    let uploadDir = '';

    try {
      const f = fs.readFileSync(file.filepath);
      const day = moment(new Date()).format('YYYYMMDD');
      const dir = path.join(this.config.uploadDir, day);
      const date = moment().format('YYYY-MM-DD HH:mm:ss');
      await mkdirp(dir);
      uploadDir = path.join(dir, date + path.extname(file.filename));
      // 写入文件夹
      fs.writeFileSync(uploadDir, f);
    } finally {
      // 清除临时文件
      ctx.cleanupRequestFiles();
    }

    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: uploadDir.replace(/app/g, ''),
    };
  }
}

module.exports = UploadController;
