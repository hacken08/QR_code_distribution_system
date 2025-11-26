import { addDoc, collection, Firestore } from 'firebase/firestore';
import { getDbInstance } from '../../../database/firebase-config';
import { userConverter } from '@/app/database/schemas/usersSchemas';



export async function GET(request: Request) {
  const db = await getDbInstance()

  console.log("Recieving a get request on route: api/auth/login")

  // Adding user to db
  try {
    console.log("Saving user to firestore database: db type", db instanceof Firestore);
    const docRef = await addDoc(collection(db, "users").withConverter(userConverter), {
      name: "anmol",
      email: "anmolgoya.code@gmail.com",
      profilePicture: "https://localhost:3000"
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

  return new Response(JSON.stringify({ message: "User added succesfully" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}


