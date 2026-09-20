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
    const lessonsSnap = await getDocs(collection(db, LESSONS_COLLECTION));

    console.log(`[📊 AcademyService] Firestore Status: ${modulesSnap.size} módulos, ${lessonsSnap.size} aulas`);

    if (modulesSnap.empty) {
      console.log('[🌱 AcademyService] Criando módulos iniciais...');
      for (const mod of INITIAL_MODULES) {
        await setDoc(doc(db, MODULES_COLLECTION, mod.id), {
          ...mod,
          createdAt: new Date().toISOString()
        });
      }
      console.log('[✅ AcademyService] Módulos iniciais criados');
    }

    if (lessonsSnap.empty) {
      console.log('[🌱 AcademyService] Criando aulas iniciais...');
      for (const les of INITIAL_LESSONS) {
        await setDoc(doc(db, LESSONS_COLLECTION, les.id), {
          ...les,
          published: les.published !== false,
          createdAt: les.createdAt || new Date().toISOString(),
          updatedAt: les.updatedAt || new Date().toISOString()
        });
      }
      console.log('[✅ AcademyService] Aulas iniciais criadas');
    }
  } catch (e) {
    console.error('[❌ AcademyService] Seed error:', e);
  }
}

export async function fetchAcademyData(): Promise<{ modules: CourseModule[]; lessons: LessonItem[] }> {
  console.log('[📡 AcademyService] Iniciando fetchAcademyData...');
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

    console.log(`[✅ AcademyService] Fetch completo: ${modules.length} módulos, ${lessons.length} aulas`);

    return {
      modules: modules.length > 0 ? modules : INITIAL_MODULES,
      lessons: lessons.length > 0 ? lessons : INITIAL_LESSONS
    };
  } catch (e) {
    console.error('[❌ AcademyService] Fetch error:', e);
    return { modules: INITIAL_MODULES, lessons: INITIAL_LESSONS };
  }
}

export function subscribeToAcademy(onUpdate: (data: { modules: CourseModule[]; lessons: LessonItem[] }) => void): () => void {
  console.log('[🔄 AcademyService] Iniciando subscription em tempo real...');
  seedAcademyIfEmpty();
  let currentModules: CourseModule[] = INITIAL_MODULES;
  let currentLessons: LessonItem[] = INITIAL_LESSONS;

  const unsubModules = onSnapshot(query(collection(db, MODULES_COLLECTION), orderBy('order', 'asc')), (snapshot) => {
    console.log(`[📡 AcademyService] Módulos atualizado: ${snapshot.docs.length} módulos`);
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
    console.error('[❌ AcademyService] Módulos subscription error:', err.code, err.message);
  });

  const unsubLessons = onSnapshot(query(collection(db, LESSONS_COLLECTION), orderBy('order', 'asc')), (snapshot) => {
    console.log(`[📡 AcademyService] Aulas atualizado: ${snapshot.docs.length} aulas`);
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
    console.error('[❌ AcademyService] Lessons subscription error:', err.code, err.message);
  });

  return () => {
    console.log('[🛑 AcademyService] Encerrando subscriptions');
    unsubModules();
    unsubLessons();
  };
}

export async function saveAcademyLessonToFirestore(lesson: LessonItem & { published?: boolean }): Promise<void> {
  console.log('[💾 AcademyService] Salvando aula:', lesson.id, lesson.title);
  
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lesson.id);
    
    const dataToSave = {
      ...lesson,
      published: lesson.published !== false,
      updatedAt: new Date().toISOString(),
      createdAt: lesson.createdAt || new Date().toISOString()
    };

    await setDoc(lessonRef, dataToSave, { merge: true });
    console.log('[✅ AcademyService] Aula salva com sucesso no Firestore!');
  } catch (error) {
    console.error('[❌ AcademyService] Erro ao salvar aula:', error);
    throw new Error(`Erro ao salvar aula no Firestore: ${(error as Error).message}`);
  }
}

export async function deleteAcademyLessonFromFirestore(lessonId: string): Promise<void> {
  console.log('[🗑️ AcademyService] Deletando aula:', lessonId);
  try {
    const lessonRef = doc(db, LESSONS_COLLECTION, lessonId);
    await deleteDoc(lessonRef);
    console.log('[✅ AcademyService] Aula deletada com sucesso');
  } catch (error) {
    console.error('[❌ AcademyService] Erro ao deletar aula:', error);
    throw error;
  }
}

export async function saveAcademyModuleToFirestore(mod: CourseModule): Promise<void> {
  console.log('[💾 AcademyService] Salvando módulo:', mod.id, mod.title);
  try {
    const modRef = doc(db, MODULES_COLLECTION, mod.id);
    await setDoc(modRef, mod, { merge: true });
    console.log('[✅ AcademyService] Módulo salvo com sucesso');
  } catch (error) {
    console.error('[❌ AcademyService] Erro ao salvar módulo:', error);
    throw error;
  }
}