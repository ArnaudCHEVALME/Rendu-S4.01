import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
    HOST: process.env.FIMU_HOSTNAME,
    USER: process.env.FIMU_USER,
    PASSWORD: process.env.FIMU_PASSWORD,
    DB: process.env.FIMU_DB_NAME,
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

export default dbConfig;