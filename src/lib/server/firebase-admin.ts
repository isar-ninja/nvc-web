import "server-only";

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { ServiceAccount } from "firebase-admin/app";

const firebaseAdminConfig = {
  type: process.env.FAT,
  project_id: process.env.FAPID,
  private_key_id: process.env.FAPKID,
  private_key: process.env.FAPKEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FACE,
  client_id: process.env.FACID,
  auth_uri: process.env.FAAU,
  token_uri: process.env.FATU,
  auth_provider_x509_cert_url: process.env.FAAPCU,
  client_x509_cert_url: process.env.FACCU,
} as ServiceAccount;

const firebaseAdmin =
  getApps().length === 0
    ? initializeApp({
        credential: cert(firebaseAdminConfig),
      })
    : getApps()[0];

const adminDb = getFirestore(firebaseAdmin);
const adminAuth = getAuth(firebaseAdmin);

export { adminDb, adminAuth };
