import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

passport.serializeUser((user, done) => {
  done(null, user.id); // Serialize using user ID
});

passport.deserializeUser((id, done) => {
  // Here you would typically fetch the user from your database using the ID
  // For this example, we'll just return a placeholder user object
  const user = { id: id, email: 'test@example.com' };
  done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
  },
  (req, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, (jwt_payload, done) => {
  return done(null, jwt_payload);
}));

export default passport;