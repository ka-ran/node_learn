import { OrmContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../enitites/User";
import argon2 from "argon2";

@InputType()
class RegisterInput {
  @Field()
  username!: string;

  @Field()
  password!: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: OrmContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: OrmContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { em, req }: OrmContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        errors: [
          {
            field: "Username",
            message: "Username too short",
          },
        ],
      };
    }
    if (options.password.length <= 2) {
      return {
        errors: [
          {
            field: "Password",
            message: "password too short",
          },
        ],
      };
    }
    const user = em.create(User, {
      username: options.username,
      password: await argon2.hash(options.password),
    });

    try {
      await em.persistAndFlush(user);
    } catch (_) {
      return {
        errors: [
          {
            field: "Username",
            message: "Username already exists",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: RegisterInput,
    @Ctx() { em, req }: OrmContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [{ field: "Username", message: "Username doesnot exist" }],
      };
    }
    const isVaild = await argon2.verify(user.password, options.password);
    if (!isVaild) {
      return {
        errors: [{ field: "Password", message: "Incorrect password" }],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }
}
