import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Float, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Post {
  @Field(() => Float)
  @PrimaryKey()
  id!: number;

  @Field(() => Float)
  @Property({ type: "date" })
  createdAt = new Date();

  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({ type: "text" })
  title!: string;
}
