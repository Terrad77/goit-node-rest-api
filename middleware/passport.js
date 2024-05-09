// npm install passport
import passport from "passport";
// npm install passport-jwt
import passportJWT from "passport-jwt";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js"; // Імпорт моделі
import "dotenv/config"; // імпорт модулю dotenv

const secret = process.env.SECRET;
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

// Опції налаштування стратегії passport-jwt
const options = {
  secretOrKey: secret,
  // Витяг токену з заголовка Authorization
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(options, async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);

// export default passport.authenticate("jwt", { session: false });

export default passport;
