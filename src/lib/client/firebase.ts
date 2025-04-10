import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FAK,
  authDomain: process.env.NEXT_PUBLIC_FAD,
  projectId: process.env.NEXT_PUBLIC_FPID,
  storageBucket: process.env.NEXT_PUBLIC_FSB,
  messagingSenderId: process.env.NEXT_PUBLIC_FMSID,
  appId: process.env.NEXT_PUBLIC_FAID,
  measurementId: process.env.NEXT_PUBLIC_FMID,
};

// Initialize Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// if (process.env.NODE_ENV === "development") {
//   const authEmulatorHost = "localhost:9099";
//   console.log(`Using Auth emulator at: ${authEmulatorHost}`);
//   connectAuthEmulator(auth, `http://${authEmulatorHost}`, {
//     disableWarnings: false,
//   });
// }

export { app, auth, db };
