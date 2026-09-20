import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { CourseModule, LessonItem } from '../types';
import { INITIAL_MODULES, INITIAL_LESSONS } from '../data/academyData';

const LESSONS_COLLECTION = 'academy_lessons';
const MODULES_COLLECTION = 'academy_modules';

export async function seedAcademyIfEmpty() {
  try {
    const modulesSnap = await getDocs(collection(db, MODULES_COLLECTION));
    if (modulesSnap.empty) {
      for (const mod of INITIAL_MODULES) {
        await setDoc(doc(db, MODULES_COLLECTION, mod.id), mod);
      }
    }

    const lessonsSnap = await getDocs(collection(db, LESSONS_COLLECTION));
    if (lessonsSnap.empty) {
      for (const les of INITIAL_LESSONS) {
        await setDoc(doc(db, LESSONS_COLLECTION, les.id), {
          ...les,
          published: les.published !== false,
          createdAt: les.createdAt || new Date().toISOString(),
          updatedAt: les.updatedAt || new Date().toISOString()
        });
      }
    }
  } catch (e) {
    console.warn('[AcademyService] Seed error:', e);
  }
}

export async function fetchAcademyData(): Promise<{ modules: CourseModule[]; lessons: LessonItem[] }> {
  await seedAcademyIfEmpty();
  try {
    const [modulesSnap, lessonsSnap] = await Promise.all([
      getDocs(query(collection(db, MODULES_COLLECTION), orderBy('order', 'asc'))),
      getDocs(query(collection(db, LESSONS_COLLECTION), orderBy('order', 'asc')))
    ]);

    const modules: CourseModule[] = [];
    modulesSnap.forEach((docSnap) => {
      const data = docSnap.data();
      modules.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        order: typeof data.order === 'number' ? data.order : 0,
        badge: data.badge || ''
      });
    });

    const lessons: LessonItem[] = [];
    lessonsSnap.forEach((docSnap) => {
      const data = docSnap.data();
      lessons.push({
        id: docSnap.id,
        moduleId: data.moduleId || 'mod-1',
        title: data.title || '',
        duration: data.duration || '10:00',
        youtubeUrlOrId: data.youtubeUrlOrId || data.youtubeId || '',
        youtubeId: data.youtubeId || '',
        description: data.description || '',
        keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
        materials: Array.isArray(data.materials) ? data.materials : [],
        promptTemplate: data.promptTemplate || '',
        order: typeof data.order === 'number' ? data.order : 0,
        published: data.published !== false
      });
    });

    return {
      modules: modules.length > 0 ? modules : INITIAL_MODULES,
      lessons: lessons.length > 0 ? lessons : INITIAL_LESSONS
    };
  } catch (e) {
    console.warn('[AcademyService] Fetch error, falling back:', e);
    return { modules: INITIAL_MODULES, lessons: INITIAL_LESSONS };
  }
}

export function subscribeToAcademy(onUpdate: (data: { modules: CourseModule[]; lessons: LessonItem[] }) => void): () => void {
  seedAcademyIfEmpty();
  let currentModules: CourseModule[] = INITIAL_MODULES;
  let currentLessons: LessonItem[] = INITIAL_LESSONS;

  const unsubModules = onSnapshot(query(collection(db, MODULES_COLLECTION), orderBy('order', 'asc')), (snapshot) => {
    const modules: CourseModule[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      modules.push({
        id: docSnap.id,
        title: data.title || '',
        description: data.description || '',
        order: typeof data.order === 'number' ? data.order : 0,
        badge: data.badge || ''
      });
    });
    currentModules = modules.length > 0 ? modules : INITIAL_MODULES;
    onUpdate({ modules: currentModules, lessons: currentLessons });
  }, (err) => {
    console.warn('[AcademyService] Modules subscription error:', err);
  });

  const unsubLessons = onSnapshot(query(collection(db, LESSONS_COLLECTION), orderBy('order', 'asc')), (snapshot) => {
    const lessons: LessonItem[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      lessons.push({
        id: docSnap.id,
        moduleId: data.moduleId || 'mod-1',
        title: data.title || '',
        duration: data.duration || '10:00',
        youtubeUrlOrId: data.youtubeUrlOrId || data.youtubeId || '',
        youtubeId: data.youtubeId || '',
        description: data.description || '',
        keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
        materials: Array.isArray(data.materials) ? data.materials : [],
        promptTemplate: data.promptTemplate || '',
        order: typeof data.order === 'number' ? data.order : 0,
        published: data.published !== false
      });
    });
    currentLessons = lessons.length > 0 ? lessons : INITIAL_LESSONS;
    onUpdate({ modules: currentModules, lessons: currentLessons });
  }, (err) => {
    console.warn('[AcademyService] Lessons subscription error:', err);
  });

  return () => {
    unsubModules();
    unsubLessons();
  };
}

export async function saveAcademyLessonToFirestore(lesson: LessonItem & { published?: boolean }): Promise<void> {
  const lessonRef = doc(db, LESSONS_COLLECTION, lesson.id);
  await setDoc(lessonRef, {
    ...lesson,
    published: lesson.published !== false,
    updatedAt: new Date().toISOString(),
    createdAt: lesson.createdAt || new Date().toISOString()
  }, { merge: true });
}

export async function deleteAcademyLessonFromFirestore(lessonId: string): Promise<void> {
  const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
  await deleteDoc(lessonRef);
}

export async function saveAcademyModuleToFirestore(mod: CourseModule): Promise<void> {
  const modRef = doc(db, MODULES_COLLECTION, mod.id);
  await setDoc(modRef, mod, { merge: true });
}
