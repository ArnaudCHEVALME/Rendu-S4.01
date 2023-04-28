import express from 'express';
import cluster from 'cluster';
import os from 'os';

import actualiteRouter from "./routes/actualite.router";
import artisteRouter from './routes/artiste.router';
import authRouter from './routes/auth.router';
import concertRouter from './routes/concert.router';
import categorieRouter from "./routes/categorie.router";
import genreRouter from "./routes/genre.router";
import notificationRouter from "./routes/notification.router";
import paysRouter from "./routes/pays.router";
import reseauxSociauxRouter from "./routes/reseauxSociaux.router";
import roleRouter from "./routes/role.router";
import saisonRouter from "./routes/saison.router";
import sceneRouter from "./routes/scene.router";
import serviceRouter from "./routes/service.router";
import standRouter from "./routes/stand.router";
import typeactuRouter from "./routes/typeactu.router";
import typesceneRouter from "./routes/typescene.router";
import typestandRouter from "./routes/typestand.router";
import utilisateurRouter from "./routes/utilisateur.router";

import dotenv from "dotenv";
import path from 'path';
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import passport from "passport";

dotenv.config({
    path: path.resolve(__dirname, './.env')
})
const PORT = process.env.FIMU_PORT

const app = express();

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mon API REST Express',
            version: '1.0.0',
            description: 'Documentation Swagger pour mon API REST Express'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Serveur local'
            }
        ]
    },
    apis: ['./routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/actualite', actualiteRouter);
app.use('/artiste', artisteRouter);
app.use('/auth', authRouter);
app.use('/categorie', categorieRouter);
app.use('/concert', concertRouter);
app.use('/genre', genreRouter);
app.use('/notification', notificationRouter);
app.use('/pays', paysRouter);
app.use('/reseauxsociaux', reseauxSociauxRouter);
app.use('/role', roleRouter);
app.use('/saison', saisonRouter);
app.use('/scene', sceneRouter);
app.use('/service', serviceRouter);
app.use('/stand', standRouter);
app.use('/typeactu', typeactuRouter);
app.use('/typescene', typesceneRouter);
app.use('/typestand', typestandRouter);
app.use('/utilisateur', utilisateurRouter);

app.use('/status', (req, res) => {
    res.status(200).json({
        error: 0,
        message: "Server is running"
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        error: 1,
        message: "La ressource demandée n'existe pas."
    });
});

app.use(cors({
    origin: ['http://localhost:8080', "https://google.com"],
    credentials: true
}));

if (cluster.isMaster) {
    const nbCpus = os.cpus().length;
    console.log(`Nombre de CPUs: ${nbCpus}`);
    for (let i = 0; i < nbCpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} killed`);
        cluster.fork();
    });

} else {
    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
    });
}