import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';
import { Funnel, FunnelStep } from '../types';

const FUNNELS_COL = 'sales_funnels';
const STEPS_COL = 'sales_funnel_steps';

// Funnels
export async function fetchFunnels(): Promise<Funnel[]> {
  const snapshot = await getDocs(collection(db, FUNNELS_COL));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Funnel));
}

export async function saveFunnel(funnel: Partial<Funnel>): Promise<string> {
  if (funnel.id) {
    await updateDoc(doc(db, FUNNELS_COL, funnel.id), { ...funnel, updatedAt: new Date().toISOString() });
    return funnel.id;
  } else {
    const docRef = await addDoc(collection(db, FUNNELS_COL), { ...funnel, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    return docRef.id;
  }
}

// Steps
export async function fetchFunnelSteps(funnelId: string): Promise<FunnelStep[]> {
  const q = query(collection(db, STEPS_COL), where('funnelId', '==', funnelId), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FunnelStep));
}

export async function saveStep(step: Partial<FunnelStep>): Promise<void> {
  if (step.id) {
    await updateDoc(doc(db, STEPS_COL, step.id), { ...step });
  } else {
    await addDoc(collection(db, STEPS_COL), { ...step });
  }
}
