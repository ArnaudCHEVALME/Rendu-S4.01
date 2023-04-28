const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
    max: 100,
    windowMS: 10000 * 6, // 10 seconde * 6 = 1 min
    message: "Vous ne pouvez pas faire plus de requête pour le moment. Réessayez plus tard",
});

export default limiter;