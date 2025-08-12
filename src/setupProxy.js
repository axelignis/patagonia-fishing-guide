const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use('/dpa', createProxyMiddleware({
    target: 'https://apis.digital.gob.cl',
    changeOrigin: true,
    pathRewrite: { '^/dpa': '/dpa' },
    onProxyReq: (proxyReq) => {
      proxyReq.removeHeader('origin');
    }
  }));
};
