import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAc2oGnS6uWlaTagUB47HWW_clFNZ2cYyE",
    authDomain: "tanya-s-portfolio.firebaseapp.com",
    projectId: "tanya-s-portfolio",
    storageBucket: "tanya-s-portfolio.firebasestorage.app",
    messagingSenderId: "524721923301",
    appId: "1:524721923301:web:d12d4c4d019446a5d3a00c",
    measurementId: "G-ETLNW3B878"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);

export const db = getFirestore(app);
