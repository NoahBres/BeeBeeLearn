import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

type Config = Parameters<typeof firebase.initializeApp>[0];

export class Fuego {
  public db: ReturnType<firebase.app.App["firestore"]>;
  public auth: typeof firebase.auth;
  public functions: typeof firebase.functions;
  public storage: typeof firebase.storage;
  constructor(config: Config) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore();
    this.auth = firebase.auth;
    this.functions = firebase.functions;
    this.storage = firebase.storage;
  }
}

const CLIENT_CONFIG = {
  apiKey: "AIzaSyD5-yB0aQUj63JOAgU1h5VDpv0LvwAWrYA",
  authDomain: "beebeelearn.firebaseapp.com",
  projectId: "beebeelearn",
  storageBucket: "beebeelearn.appspot.com",
  messagingSenderId: "684027389971",
  appId: "1:684027389971:web:ffc341f4af00f827c477e6",
  measurementId: "G-259HBTELLX",
};

const fuego = new Fuego(CLIENT_CONFIG);

export default fuego;
