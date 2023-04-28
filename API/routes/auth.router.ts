import {Router} from "express";
import {verifySignUp} from "../middleware";
import authController from "../controllers/auth.controller";
import config from "../config/auth.config";
import jwt from 'jsonwebtoken';
import {dbCommon} from "../models";

const router = Router();
const passport = require('passport');
const googlePassport = require('../config/google-passport.config');

router.post('/signup', [verifySignUp.checkDuplicateUsername], authController.signup);
router.post('/signin', authController.signin);
router.get('/google', (req, res, next) => {
    // Set the Access-Control-Allow-Origin header to allow requests from your VueJS app
    res.set('Access-Control-Allow-Origin', req.headers.origin);

    // Call passport.authenticate to initiate the authentication process
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })(req, res, next);
});

router.get('/google/redirect',
    passport.authenticate('google', {session: false,}),
    async (req, res) => {
        console.log(req)
        const user = req.user;
        let token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: config.jwtExpiration
        });
        let refreshToken = await dbCommon.refreshTokens.createToken(user);
        res.status(200).send({
            id: user.id,
            identifiant: user.identifiant,
            role: user.role.libelle,
            accessToken: token,
            refreshToken: refreshToken
        });
    });


export default router;