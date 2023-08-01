import { Request, Response } from 'express';
import User from '../models/User.js';

export const signupController = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  const userExists = await User.exists({ email, username, password });
  if (userExists) {
    return res.status(400).json({ error: 'That user already exists' });
  }

  try {
    const user = await new User({
      email,
      username,
      password,
    }).save();
    return res.json({ message: 'Sign up success', user });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
  }
};

export const signinController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  let user;
  try {
    if (username.includes('@')) {
      user = await User.findOne({ email: username });
    } else {
      user = await User.findOne({ username });
    }
    res.json({ message: 'Sign in success', user });
  } catch (error) {
    if (error instanceof Error)
      return res.status(400).json({ error: error.message });
  }
};
