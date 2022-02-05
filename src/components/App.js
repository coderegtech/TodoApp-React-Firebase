import { useState } from "react";
import Todo from "./Todo/Todo";
import Login from "./Login/Login";
import { auth } from "../firebase-config";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

function App() {
  const [user, setUser] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const signInWithGoogle = async () => {
    const googleProvider = new GoogleAuthProvider(auth);
    await signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        setUser(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {user ? (
        <Todo user={user} />
      ) : (
        <Login signInWithGoogle={signInWithGoogle} />
      )}
    </>
  );
}

export default App;
