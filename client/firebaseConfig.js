// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyDt5BDORsp0-rl2Kf9MV0PZXZLvaedSK8Y",
    authDomain: "societyy-03041218.firebaseapp.com",
    projectId: "societyy-03041218",
    storageBucket: "societyy-03041218.firebasestorage.app",
    messagingSenderId: "95500211828",
    appId: "1:95500211828:web:71af108758df1da863e321",
    measurementId: "G-S9KH30JJ87"
  };    

  const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };