import redis from "redis";
import connectRedis from "connect-redis";
import session from "express-session";
import { __prod__ } from "../../constants";

const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

export const sessionConfig: session.SessionOptions = {
  name: "qid",
  store: new RedisStore({
    client: redisClient,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 10000,
    httpOnly: true,
    sameSite: "lax",
    secure: __prod__, // works in https
  },
  saveUninitialized: false,
  secret: "session secret",
  resave: false,
};
