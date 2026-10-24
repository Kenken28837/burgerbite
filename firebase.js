
const firebaseConfig = {
  apiKey: "AIzaSyC0DljJY772LSpAu-0Isl2gsKOsTLKRCLQ",
  authDomain: "mannbuns.firebaseapp.com",
  projectId: "mannbuns",
  storageBucket: "mannbuns.firebasestorage.app",
  messagingSenderId: "618115893903",
  appId: "1:618115893903:web:53db0e96b01968f507befa",
  measurementId: "G-0PQkSH7YHNP"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
