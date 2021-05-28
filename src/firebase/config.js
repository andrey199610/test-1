import app from "firebase/app";
import "firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyAM7lW8NQP3-qU-YI9DMTZYiDRGcW5wm2M",
  authDomain: "trello-clone-8dcec.firebaseapp.com",
  projectId: "trello-clone-8dcec",
  storageBucket: "trello-clone-8dcec.appspot.com",
  messagingSenderId: "737745907069",
  appId: "1:737745907069:web:503cad4a1794aa0d77b014",
  measurementId: "G-08BE2PZRJ3",
};
const firebase = app.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
export { firebase, firestore, app };
