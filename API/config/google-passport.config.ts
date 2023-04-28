const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');

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
    new GoogleStrategy({
            // options for google strategy
            callbackURL: 'http://localhost:8080/auth/google/redirect',
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            const userData = {
                identifiant: profile.emails[0].value,
                motDePasse: profile.id,
                roleId: 2
            }
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