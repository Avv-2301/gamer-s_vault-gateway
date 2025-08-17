const { createProxyMiddleware } = require('http-proxy-middleware');

function proxyFactory(target, pathRewrite = {}){
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        pathRewrite,
        onProxyReq: (proxyReq, req) =>{
            if(req.user){
                proxyReq.setHeader("x-user-id",req.user.id);
                proxyReq.setHeader("x-usser-email",req.user.email);
                proxyReq.setHeader("x-user-role",req.user.role);
            }
        }
    })
}

module.exports = proxyFactory;