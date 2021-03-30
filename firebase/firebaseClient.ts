import firebaseClient from "firebase/app";
import "firebase/auth";

const CLIENT_CONFIG = {
  apiKey: "AIzaSyD5-yB0aQUj63JOAgU1h5VDpv0LvwAWrYA",
  authDomain: "beebeelearn.firebaseapp.com",
  projectId: "beebeelearn",
  storageBucket: "beebeelearn.appspot.com",
  messagingSenderId: "684027389971",
  appId: "1:684027389971:web:ffc341f4af00f827c477e6",
  measurementId: "G-259HBTELLX",
};

if (typeof window !== "undefined" && !firebaseClient.apps.length) {
  firebaseClient.initializeApp(CLIENT_CONFIG);
  firebaseClient
    .auth()
    .setPersistence(firebaseClient.auth.Auth.Persistence.SESSION);
  (window as any).firebase = firebaseClient;
}

export { firebaseClient };
