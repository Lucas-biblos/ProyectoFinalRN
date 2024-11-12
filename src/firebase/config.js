import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyB5nBc-doKgxv2lyU2D7qMuNaonXRho3zg",
  authDomain: "biblosybognirn.firebaseapp.com",
  projectId: "biblosybognirn",
  storageBucket: "biblosybognirn.firebasestorage.app",
  messagingSenderId: "433096979946",
  appId: "1:433096979946:web:edeba4119f057a83206e93"
};

app.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();

