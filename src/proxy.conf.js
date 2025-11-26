module.exports = {
    "/api": {
        target: process.env.API_BACKEND,
        secure: false,
        changeOrigin: true,
        "pathRewrite": {
            "^/api": "/api"
        },
    },
    "/register": {
        changeOrigin: true,
        bypass: (req, res) => {
            if (req.url == "/register") {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    status: "ok",
                }));
                return true;
            }
            return false;
        },
    },
    "/repayment": {
        changeOrigin: true,
        bypass: (req, res) => {
            if (req.url != "/repayment") {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({
                    status: "ok",
                }));
                return true;
            } return false;
        },
    }
};
