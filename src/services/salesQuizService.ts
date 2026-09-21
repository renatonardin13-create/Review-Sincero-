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
  orderBy,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { QuizQuestion, QuizResult, QuizProduct, QuizSettings } from '../types';

const QUESTIONS_COL = 'quiz_questions';
const RESULTS_COL = 'quiz_results';
const PRODUCTS_COL = 'quiz_products';
const SETTINGS_COL = 'quiz_settings';

// Questions
export async function fetchQuestions(): Promise<QuizQuestion[]> {
  const q = query(collection(db, QUESTIONS_COL), orderBy('order', 'asc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizQuestion));
}

export async function saveQuestion(question: Partial<QuizQuestion>): Promise<void> {
  if (question.id) {
    await updateDoc(doc(db, QUESTIONS_COL, question.id), { ...question });
  } else {
    await addDoc(collection(db, QUESTIONS_COL), { ...question, createdAt: new Date().toISOString() });
  }
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, QUESTIONS_COL, id));
}

// Products
export async function fetchProducts(): Promise<QuizProduct[]> {
  const snapshot = await getDocs(collection(db, PRODUCTS_COL));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizProduct));
}

export async function saveProduct(product: Partial<QuizProduct>): Promise<void> {
  if (product.id) {
    await updateDoc(doc(db, PRODUCTS_COL, product.id), { ...product });
  } else {
    await addDoc(collection(db, PRODUCTS_COL), { ...product, createdAt: new Date().toISOString() });
  }
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COL, id));
}

// Results
export async function fetchResults(): Promise<QuizResult[]> {
  const snapshot = await getDocs(collection(db, RESULTS_COL));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuizResult));
}

export async function saveResult(result: Partial<QuizResult>): Promise<void> {
  if (result.id) {
    await updateDoc(doc(db, RESULTS_COL, result.id), { ...result });
  } else {
    await addDoc(collection(db, RESULTS_COL), { ...result, createdAt: new Date().toISOString() });
  }
}

export async function deleteResult(id: string): Promise<void> {
  await deleteDoc(doc(db, RESULTS_COL, id));
}

// Settings
export async function fetchSettings(): Promise<QuizSettings | null> {
  const docRef = doc(db, SETTINGS_COL, 'config');
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    // Seed default settings if missing
    const defaultSettings: QuizSettings = {
      id: 'config',
      status: 'active',
      title: 'Quiz de Vendas',
      description: 'Descubra qual produto combina com você',
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, { ...defaultSettings });
    return defaultSettings;
  }
  return { id: snapshot.id, ...snapshot.data() } as QuizSettings;
}

export async function saveSettings(settings: QuizSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_COL, 'config');
  await updateDoc(docRef, { ...settings, updatedAt: new Date().toISOString() });
}
