const rateLimiter = require("express-rate-limit");

const limiter = rateLimiter({
    max: 300,
    windowMS: 1000, // 1 seconde
    //300 requêtes par seconde max
    message: "Vous ne pouvez pas faire plus de requête pour le moment. Réessayez plus tard",
});

export default limiter;