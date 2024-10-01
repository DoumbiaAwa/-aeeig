// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACOzAJ8cOjhb-Re9Zs3lBn1bho6ZeWsV4",
  authDomain: "aeeig-f018d.firebaseapp.com",
  databaseURL: "https://aeeig-f018d-default-rtdb.firebaseio.com/",
  projectId: "aeeig-f018d",
  storageBucket: "aeeig-f018d.appspot.com",
  messagingSenderId: "562539657530",
  appId: "1:562539657530:web:73f3c8eaa2dec578ed7803",
  measurementId: "G-1KJJH8XWVN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
export { app, database, auth };