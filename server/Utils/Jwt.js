import jwt from 'jsonwebtoken';
export const createToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '2h' });