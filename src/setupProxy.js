// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://api.notion.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // 프록시 경로 재작성
      },
    })
  );
};
