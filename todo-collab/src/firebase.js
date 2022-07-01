import firebase from 'firebase/app'
import 'firebase/auth';
import "firebase/storage";
import 'firebase/firestore';
require('dotenv').config()

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJ_ID,
  storageBucket: process.env.REACT_APP_STORE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MGS_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};


let app;
if(firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { storage, auth, db };