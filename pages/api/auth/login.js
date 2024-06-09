import { compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabaseConnection } from "@/utils/database";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET;
export default async function handler(req, res) {

  const db = await getDatabaseConnection();
  if (req.method === 'POST') {
    const { username, password } = req.body;


    const user = await db.collection('AUTH').find({ username: username }).toArray();
    if (user.length === 0) {
      return res.status(401).json({ ERROR: 'INVALID USERNAME OR PASSWORD' });
    }

    const check_password = await compare(password, user[0].hashed_password)
    if (!check_password) {
      return res.status(401).json({ ERROR: 'INVALID USERNAME OR PASSWORD' });
    }
    
    const token = jwt.sign({ username: user[0].username }, SECRET_KEY, { expiresIn: '1h' });
    return res.status(200).json({ message: 'LOGIN SUCCESS', data:token} );

  } else {
    return res.status(405).json({ ERROR: 'INVALID METHOD' });
  }
}
