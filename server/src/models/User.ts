import { createHmac } from 'crypto';
import { Document, Schema, model } from 'mongoose';

interface UserSchema {
  email: string;
  username: string;
  hash_password: string;
  salt: string;
  role: string;
  verified: boolean;
}

interface UserModel extends UserSchema, Document {
  _password?: string;
  authenticate: (password: string) => boolean;
  genSalt: () => string;
  genHash: (password?: string) => string;
}

const userSchema: Schema = new Schema<UserSchema>(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      max: 32,
    },
    hash_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = this.genSalt();
  this.hash_password = this.genHash(password);
});

userSchema.methods = {
  authenticate: function (password: string) {
    return this.genHash(password) === this.hash_password;
  },

  genHash: function (password?: string) {
    if (!password) return '';

    const HMAC = createHmac('sha256', this.salt);

    try {
      const hash = HMAC.update(password).digest('hex');
      console.log(hash);
      return hash;
    } catch (error) {
      return '';
    }
  },

  genSalt: function () {
    return Math.floor(new Date().valueOf() * Math.random()).toString();
  },
};

userSchema.index(
  { createdAt: 1 },
  { partialFilterExpression: { verified: false }, expires: '1d' }
);

export default model<UserModel>('User', userSchema);
