import { Connection, IDatabaseDriver, Options } from "@mikro-orm/core";
import path from "path/posix";
import { User } from "../enitites/User";
import { __prod__ } from "../constants";
import { Post } from "../enitites/Post";

export default {
  type: "postgresql",
  migrations: {
    path: path.join(__dirname, "./migrations"),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  //   connection
  dbName: "backend",
  user: "",
  password: "",
  wrap: false,
  // Debugging
  debug: !__prod__,
  // tables
  entities: [Post, User],
} as Options<IDatabaseDriver<Connection>>;
