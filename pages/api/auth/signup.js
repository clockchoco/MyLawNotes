import {hash} from 'bcryptjs';
import { getDatabaseConnection } from "@/utils/database"; 

export default async function handler(req, res) {

    const db = await getDatabaseConnection();
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const existing_user = await db.collection('AUTH').find( { username: username }).toArray();
    
    if (existing_user.length !== 0) {
      console.log(existing_user[0].username)
      return res.status(400).json({ ERROR: 'USERNAME ALREADY EXISTS' });
    }

    const hashed_password = await hash(password, 10);

    await db.collection('AUTH').insertOne({ 
      username:username, 
      hashed_password:hashed_password 
    });

    console.log(`${username} 회원가입 성공`)
    return res.status(201).json({ message: `${username} 회원가입 성공!`});
  } else {
    return res.status(405).json({ ERROR: 'INVALID METHOD' });
  }
}
