import { getDatabaseConnection } from "@/utils/database"; 
export default async function handler(req, res) {
  const db = await getDatabaseConnection();
    const law_page_id = req.query.law_page_id;
  if (req.method === 'POST') {
    const { username, index, text} = req.body;
    await db.collection(`selectedElements${law_page_id}`).insertOne({ username:username, index:index,text:text });
    console.log(`USERNAME ${username} INDEX ${index} data insert SUCCESS`)
    console.log('POST METHOD SUCCESS');
    return res.status(200).json({ message: `POST METHOD SUCCESS USERNAME:${username} INDEX:${index}` });
  }
  else if (req.method === 'DELETE') {
    const { username, index } = req.body;
    const filter = { username:username, index: index };
    const result = await db.collection(`selectedElements${law_page_id}`).deleteMany(filter);
    console.log(`User ${username} deleted element with index ${index}`);
    console.log('DELETE METHOD SUCCESS')
    return res.status(200).json({ success: true, message: `DELETE METHOD SUCCESS USERNAME:${username} INDEX:${index}` });
  }
  else if (req.method === 'GET') {
    const { username } = req.query;
    const elements = await db.collection(`selectedElements${law_page_id}`).find({username: username}).toArray();
    console.log('GET METHOD SUCCESS')
    return res.status(200).json(elements);
  }
  else {
    return res.status(405).json({ message: 'INVALID METHOD' });
  }
}


