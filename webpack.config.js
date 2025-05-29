const webpack = require("webpack");
const dotenv = require("dotenv");
const fs = require("fs");

// โหลดไฟล์ .env (หรือกำหนดค่าตรงๆ ได้เช่นกัน)
const envFile = dotenv.parse(fs.readFileSync(".env"));

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(envFile),
    }),
  ],
};
