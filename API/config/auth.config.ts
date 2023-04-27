import dotenv from "dotenv";
dotenv.config();

const secret = process.env.AUTH_SECRET || 'fimudonnelargent';

export default {
    secret: secret,
    jwtExpiration: 1800,
    jwtRefreshExpiration: 86400
}

