import { DocumentType, getModelForClass, pre, prop } from "@typegoose/typegoose";
import * as bcrypt from "bcryptjs";
import crypto from "crypto";

export const gravatar = (size: number = 200, email?: string) => {
  if (!email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  }
  const md5 = crypto
    .createHash("md5")
    .update(email)
    .digest("hex");

  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export interface AuthToken {
  accessToken: string;
  kind: string;
}

interface Profile {
  name: string;
  gender: string;
  location: string;
  website: string;
  picture: string;
}

@pre<IUser>("save", function (next) {
  bcrypt.hash(this.password, 10).then(next).catch(next);
})
class IUser {
  @prop({
    unique: true,
  })
  email: string;
  @prop()
  password: string;
  @prop()
  passwordResetToken: string;
  @prop()
  passwordResetExpires: Date;
  @prop()
  facebook: string;
  @prop()
  tokens: AuthToken[];

  @prop({
    default: {
      name: "",
      gender: "",
      location: "",
      website: "",
      picture: "",
    } as Profile
  })
  profile: Profile

  gravatar(size?: number): ReturnType<typeof gravatar> {
    return gravatar(size, this.email);
  }
}

export type UserDocument = DocumentType<IUser>;

export const User = getModelForClass(IUser, { schemaOptions: { timestamps: true } });
