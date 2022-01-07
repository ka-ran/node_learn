import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import session, { Session } from "express-session";

type CustomSession = Session &
  Partial<session.SessionData> & { userId?: number };

type Req = Express.Request & { session: CustomSession };

export type OrmContext = {
  em: EntityManager<IDatabaseDriver<Connection>>;
  req: Req;
  res: Express.Response;
};
