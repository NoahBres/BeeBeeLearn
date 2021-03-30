import { firebaseClient } from "../firebase/firebaseClient";
import firebase from "firebase/app";

import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    await firebaseClient.auth().signInWithPopup(provider);
    router.push("/student");
  };

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}
