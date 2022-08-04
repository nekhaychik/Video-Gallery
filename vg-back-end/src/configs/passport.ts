import passport from 'passport';
import { getRepository } from 'typeorm';
import { User } from '../entities/user/user.entity';
import { StringError } from '../errors/string.error';
const localStrategy = require('passport-local').Strategy;

// @ts-ignore
const local = new localStrategy(async (username, password, done) => {
  try {
    const user = await getRepository(User).findOne({ email: username });
    if (!user) {
      return done(null, false, { message: 'Unknown User' });
    }
    if (user.password === password) {
      return done(null, user);
    }
    return done(null, false, { message: 'Invalid password' });
  } catch (error) {
    return done(error, null);
  }
});

passport.serializeUser((user: User, done) => {
  done(null, user);
});

passport.deserializeUser(async (username: string, done) => {
  try {
    const user = await getRepository(User).findOne({ email: username })
    if (user) {
      done(null, user);
    } else {
      throw new StringError('User does not exist');
    }
  } catch (err) {
    done(err, null);
  }
});

passport.use(local);

export default passport;
