import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs
} from 'firebase/firestore';
import { WeddingInvitation } from '../types';

const firebaseConfig = {
  projectId: "gen-lang-client-0618371462",
  appId: "1:530836806615:web:676f0f335f73beab79c992",
  apiKey: "AIzaSyBZPLsDuFksC4ptpppQ1V3bbvSYWm2FxBk",
  authDomain: "gen-lang-client-0618371462.firebaseapp.com",
  storageBucket: "gen-lang-client-0618371462.firebasestorage.app",
  messagingSenderId: "530836806615"
};

const databaseId = "ai-studio-casamenteira-3b72ed3e-939e-479b-a185-c7eddf730d59";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific Database ID
export const db = initializeFirestore(app, {}, databaseId);

const INVITATIONS_COLLECTION = 'invitations';

/**
 * Saves or updates a wedding invitation in Firestore.
 */
export async function saveInvitationToDb(invitation: WeddingInvitation): Promise<void> {
  if (!invitation.id) {
    throw new Error('ID do convite inválido');
  }
  const docRef = doc(db, INVITATIONS_COLLECTION, invitation.id);
  await setDoc(docRef, invitation, { merge: true });
}

/**
 * Retrieves a wedding invitation by its document ID.
 */
export async function getInvitationById(id: string): Promise<WeddingInvitation | null> {
  const docRef = doc(db, INVITATIONS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as WeddingInvitation;
  }
  return null;
}

/**
 * Retrieves a wedding invitation by its slug or ID.
 * This is perfect for custom URLs, e.g. /?c=maria-e-joao
 */
export async function getInvitationBySlugOrId(slugOrId: string): Promise<WeddingInvitation | null> {
  if (!slugOrId) return null;
  
  // 1. Try directly by ID
  const directDoc = await getInvitationById(slugOrId);
  if (directDoc) return directDoc;

  // 2. Try querying by the 'slug' field
  const q = query(collection(db, INVITATIONS_COLLECTION), where('slug', '==', slugOrId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as WeddingInvitation;
  }

  // 3. Fallback to lowercase search
  const qLower = query(collection(db, INVITATIONS_COLLECTION), where('slug', '==', slugOrId.toLowerCase()));
  const querySnapshotLower = await getDocs(qLower);
  
  if (!querySnapshotLower.empty) {
    return querySnapshotLower.docs[0].data() as WeddingInvitation;
  }

  return null;
}

/**
 * Gets invitations associated with a specific client's email address.
 * Useful for finding their work.
 */
export async function getInvitationsByEmail(email: string): Promise<WeddingInvitation[]> {
  if (!email) return [];
  const q = query(
    collection(db, INVITATIONS_COLLECTION), 
    where('clientEmail', '==', email.trim().toLowerCase())
  );
  const querySnapshot = await getDocs(q);
  const results: WeddingInvitation[] = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.data() as WeddingInvitation);
  });
  return results;
}

/**
 * Retrieves all invitations (for the administrator view)
 */
export async function getAllInvitationsFromDb(): Promise<WeddingInvitation[]> {
  const querySnapshot = await getDocs(collection(db, INVITATIONS_COLLECTION));
  const results: WeddingInvitation[] = [];
  querySnapshot.forEach((doc) => {
    results.push(doc.data() as WeddingInvitation);
  });
  // Sort by date/id descending to show newest first
  return results.sort((a, b) => b.id.localeCompare(a.id));
}
