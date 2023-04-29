const passport = require('passport');
const GithubStrategy = require('passport-github2');

import {dbCommon} from "../models";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    dbCommon.utilisateurs.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GithubStrategy({
            // options for google strategy
            callbackURL: 'http://localhost:8080/auth/github/redirect',
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email']
        },
        async (accessToken, refreshToken, profile, done) => {
            const userData = {
                identifiant: profile.username,
                motDePasse: profile.id,
                roleId: 2
            }
            console.log(userData)
            try {
                const result = await findOrCreate(userData)
                done(null, result.user)
            } catch (err) {
                console.error(err)
                done(err, null)
            }
        }
    )
);

// find or create user
const findOrCreate = async (userData) => {
    const {identifiant} = userData
    try {
        const user = await dbCommon.utilisateurs.findOne({where: {identifiant: identifiant}, include: dbCommon.roles})
        if (user) {
            return {user: user, created: false}
        }
        await dbCommon.utilisateurs.create(userData)
        const newUser = await dbCommon.utilisateurs.findOne({where: {identifiant: identifiant}, include: dbCommon.roles})
        return {user: newUser, created: true}
    } catch (e) {
        console.error(e)
    }
}