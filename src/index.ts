import { MikroORM } from "@mikro-orm/core";
import express from "express";
import config from "./config/mikro-orm.config";

import { __prod__ } from "./constants";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

import { OrmContext } from "./types";
import { sessionConfig } from "./config/session/session";
import session from "express-session";

const main = async () => {
  // Database connection
  const orm = await MikroORM.init(config);
  //   Run all the migrations
  await orm.getMigrator().up();

  //Start Server
  const app = express();

  app.use(session(sessionConfig));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): OrmContext => ({ em: orm.em, req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Hey");
  });
};

main();
