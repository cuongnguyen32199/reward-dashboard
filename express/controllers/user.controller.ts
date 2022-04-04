import bcrypt from 'bcrypt';

import User from './../models/User';

export async function login(data: { email: string, password: string }) {
  const user = await User.findOne({ email: data.email.toLowerCase() }).select(['email', 'password']);

  if (!user) throw new Error('Email doesn\'t exist');

  const valid = bcrypt.compareSync(data.password, user.password);

  if (!valid) throw new Error('Invalid credentials');

  return { email: user.email };
}

export async function create(data: { email: string, password: string }) {
  const existed = await User.findOne({ email: data.email.toLowerCase() });

  if (existed) throw new Error('Email already existed');

  const passwordHash = bcrypt.hashSync(data.password, 10);

  const user = await User.create({ email: data.email.toLowerCase(), password: passwordHash });

  return { _id: user._id, email: user.email };
}

export async function filter() {
  return User.find({}).sort({ 'created_at': 'desc' });
}
