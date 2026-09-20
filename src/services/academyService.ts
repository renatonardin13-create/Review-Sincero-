import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { AcademyModule, AcademyLesson, AuthUser, ADMIN_EMAIL } from '../types';
import { createAutomatedSystemNotification } from './notificationService';

const MODULES_COLLECTION = 'academy_modules';
const LESSONS_COLLECTION = 'academy_lessons';

// Initial educational modules for users if collection is empty
export const DEFAULT_ACADEMY_MODULES: AcademyModule[] = [
  {
    id: 'mod-01',
    title: 'MÓDULO 01: Começando no Review Sincero',
    description: 'Fundamentos da plataforma, mentalidade de alta conversão e visão geral do sistema.',
    order: 1,
    status: 'published',
    createdAt: '2026-03-01T10:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'mod-02',
    title: 'MÓDULO 02: Criação de Páginas & Ofertas',
    description: 'Como estruturar reviews que vendem, gatilhos de sinceridade e quebra de objeções.',
    order: 2,
    status: 'published',
    createdAt: '2026-03-02T10:00:00.000Z',
    updatedAt: '2026-03-02T10:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'mod-03',
    title: 'MÓDULO 03: IA e Construção com PRD',
    description: 'Como exportar seu PRD/Prompt para Lovable, Google AI Studio, Claude e v0.',
    order: 3,
    status: 'published',
    createdAt: '2026-03-03T10:00:00.000Z',
    updatedAt: '2026-03-03T10:00:00.000Z',
    createdBy: ADMIN_EMAIL
  }
];

export const DEFAULT_ACADEMY_LESSONS: AcademyLesson[] = [
  {
    id: 'les-01-01',
    moduleId: 'mod-01',
    title: 'Aula 01: Introdução ao Review Sincero',
    description: 'Conheça os pilares do Review Sincero e por que a verdade vende muito mais do que promessas falsas.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    duration: '10 min',
    order: 1,
    status: 'published',
    publishedAt: '2026-03-01T11:00:00.000Z',
    createdAt: '2026-03-01T11:00:00.000Z',
    updatedAt: '2026-03-01T11:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-01-02',
    moduleId: 'mod-01',
    title: 'Aula 02: Conhecendo as Ferramentas da Plataforma',
    description: 'Tour prático pelas funcionalidades: Produtos Campeões, Comparador de Produtos e Tendências de Busca.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    duration: '14 min',
    order: 2,
    status: 'published',
    publishedAt: '2026-03-01T11:30:00.000Z',
    createdAt: '2026-03-01T11:30:00.000Z',
    updatedAt: '2026-03-01T11:30:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-01-03',
    moduleId: 'mod-01',
    title: 'Aula 03: Criando seu Primeiro Review Estruturado',
    description: 'Passo a passo preenchendo as informações reais do produto e gerando a estrutura completa de análise.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    duration: '18 min',
    order: 3,
    status: 'published',
    publishedAt: '2026-03-01T12:00:00.000Z',
    createdAt: '2026-03-01T12:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-02-01',
    moduleId: 'mod-02',
    title: 'Aula 01: Estrutura Psicológica de uma Página de Conversão',
    description: 'Como organizar os elementos visuais, notas sinceras, prós e contras para prender a atenção.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    duration: '12 min',
    order: 1,
    status: 'published',
    publishedAt: '2026-03-02T10:30:00.000Z',
    createdAt: '2026-03-02T10:30:00.000Z',
    updatedAt: '2026-03-02T10:30:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-02-02',
    moduleId: 'mod-02',
    title: 'Aula 02: Como Criar uma Oferta Irresistível',
    description: 'Preço promocional, bônus, garantia e chamada para ação (CTA) com alta taxa de clique.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    duration: '16 min',
    order: 2,
    status: 'published',
    publishedAt: '2026-03-02T11:00:00.000Z',
    createdAt: '2026-03-02T11:00:00.000Z',
    updatedAt: '2026-03-02T11:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-03-01',
    moduleId: 'mod-03',
    title: 'Aula 01: O que é o PRD e por que ele supera prompts genéricos',
    description: 'Entenda como o Documento de Requisitos de Produto gera código React + Tailwind limpo e perfeito.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    duration: '15 min',
    order: 1,
    status: 'published',
    publishedAt: '2026-03-03T14:00:00.000Z',
    createdAt: '2026-03-03T14:00:00.000Z',
    updatedAt: '2026-03-03T14:00:00.000Z',
    createdBy: ADMIN_EMAIL
  },
  {
    id: 'les-03-02',
    moduleId: 'mod-03',
    title: 'Aula 02: Criando sua Página em 1 Minuto no Lovable e Google AI Studio',
    description: 'Exportação em 1 clique: colando o prompt e assistindo à IA gerar sua página pronta para publicar.',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    duration: '20 min',
    order: 2,
    status: 'published',
    publishedAt: '2026-03-03T15:00:00.000Z',
    createdAt: '2026-03-03T15:00:00.000Z',
    updatedAt: '2026-03-03T15:00:00.000Z',
    createdBy: ADMIN_EMAIL
  }
];

// Subscribe to Academy Modules
export function subscribeAcademyModules(callback: (modules: AcademyModule[]) => void): () => void {
  try {
    const q = query(collection(db, MODULES_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(DEFAULT_ACADEMY_MODULES);
          return;
        }
        const list: AcademyModule[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            title: data.title || '',
            description: data.description || '',
            order: typeof data.order === 'number' ? data.order : 0,
            status: data.status || 'published',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            createdBy: data.createdBy || ADMIN_EMAIL
          });
        });
        callback(list.length > 0 ? list : DEFAULT_ACADEMY_MODULES);
      },
      (error) => {
        console.warn('[academyService] Snapshot error on modules:', error);
        callback(DEFAULT_ACADEMY_MODULES);
      }
    );
  } catch (e) {
    console.warn('[academyService] Could not setup modules snapshot:', e);
    callback(DEFAULT_ACADEMY_MODULES);
    return () => {};
  }
}

// Subscribe to Academy Lessons
export function subscribeAcademyLessons(callback: (lessons: AcademyLesson[]) => void): () => void {
  try {
    const q = query(collection(db, LESSONS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          callback(DEFAULT_ACADEMY_LESSONS);
          return;
        }
        const list: AcademyLesson[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            moduleId: data.moduleId || '',
            title: data.title || '',
            description: data.description || '',
            videoUrl: data.videoUrl || '',
            thumbnailUrl: data.thumbnailUrl || '',
            duration: data.duration || '',
            order: typeof data.order === 'number' ? data.order : 0,
            status: data.status || 'published',
            publishedAt: data.publishedAt || '',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            createdBy: data.createdBy || ADMIN_EMAIL
          });
        });
        callback(list.length > 0 ? list : DEFAULT_ACADEMY_LESSONS);
      },
      (error) => {
        console.warn('[academyService] Snapshot error on lessons:', error);
        callback(DEFAULT_ACADEMY_LESSONS);
      }
    );
  } catch (e) {
    console.warn('[academyService] Could not setup lessons snapshot:', e);
    callback(DEFAULT_ACADEMY_LESSONS);
    return () => {};
  }
}

// Save or Update Module (Admin only)
export async function saveAcademyModule(
  item: Partial<AcademyModule>,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string; id?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador master pode gerenciar a Academia.' };
  }

  if (!item.title || !item.title.trim()) {
    return { success: false, error: 'O título do módulo é obrigatório.' };
  }

  const now = new Date().toISOString();
  const id = item.id || 'mod-' + Date.now();
  const isPublishing = item.status === 'published';

  try {
    const docRef = doc(db, MODULES_COLLECTION, id);
    await setDoc(
      docRef,
      {
        id,
        title: item.title.trim(),
        description: item.description?.trim() || '',
        order: typeof item.order === 'number' ? item.order : 1,
        status: item.status || 'published',
        createdAt: item.createdAt || now,
        updatedAt: now,
        createdBy: currentUser?.email || ADMIN_EMAIL
      },
      { merge: true }
    );

    // Automatic notification triggered on new module publication
    if (isPublishing) {
      await createAutomatedSystemNotification({
        type: 'module',
        title: '📚 NOVO MÓDULO DISPONÍVEL',
        message: `Um novo conteúdo foi adicionado à Academia: "${item.title.trim()}".`,
        targetView: 'academia',
        targetId: id,
        ctaText: 'VER MÓDULO'
      });
    }

    return { success: true, id };
  } catch (e: any) {
    console.error('[academyService] Error saving module:', e);
    return { success: false, error: e?.message || 'Erro ao salvar módulo no Firestore.' };
  }
}

// Delete Module (Admin only)
export async function deleteAcademyModule(
  moduleId: string,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado.' };
  }

  try {
    await deleteDoc(doc(db, MODULES_COLLECTION, moduleId));
    return { success: true };
  } catch (e: any) {
    console.error('[academyService] Error deleting module:', e);
    return { success: false, error: e?.message || 'Erro ao excluir módulo.' };
  }
}

// Save or Update Lesson (Admin only)
export async function saveAcademyLesson(
  item: Partial<AcademyLesson>,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string; id?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado. Apenas o administrador master pode gerenciar as aulas.' };
  }

  if (!item.title || !item.title.trim()) {
    return { success: false, error: 'O título da aula é obrigatório.' };
  }
  if (!item.moduleId) {
    return { success: false, error: 'Selecione o módulo para a aula.' };
  }
  if (!item.videoUrl || !item.videoUrl.trim()) {
    return { success: false, error: 'A URL do vídeo é obrigatória.' };
  }

  const now = new Date().toISOString();
  const id = item.id || 'les-' + Date.now();
  const isPublishing = item.status === 'published';

  try {
    const docRef = doc(db, LESSONS_COLLECTION, id);
    await setDoc(
      docRef,
      {
        id,
        moduleId: item.moduleId,
        title: item.title.trim(),
        description: item.description?.trim() || '',
        videoUrl: item.videoUrl.trim(),
        thumbnailUrl: item.thumbnailUrl?.trim() || '',
        duration: item.duration?.trim() || '',
        order: typeof item.order === 'number' ? item.order : 1,
        status: item.status || 'published',
        publishedAt: isPublishing ? (item.publishedAt || now) : '',
        createdAt: item.createdAt || now,
        updatedAt: now,
        createdBy: currentUser?.email || ADMIN_EMAIL
      },
      { merge: true }
    );

    // Automatic notification triggered on lesson publication
    if (isPublishing) {
      await createAutomatedSystemNotification({
        type: 'lesson',
        title: '🎓 NOVA AULA DISPONÍVEL',
        message: item.title.trim(),
        targetView: 'academia',
        targetId: id,
        ctaText: 'ASSISTIR AULA'
      });
    }

    return { success: true, id };
  } catch (e: any) {
    console.error('[academyService] Error saving lesson:', e);
    return { success: false, error: e?.message || 'Erro ao salvar aula no Firestore.' };
  }
}

// Delete Lesson (Admin only)
export async function deleteAcademyLesson(
  lessonId: string,
  currentUser: AuthUser | null
): Promise<{ success: boolean; error?: string }> {
  const isAdmin = currentUser?.email && currentUser.email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim();
  if (!isAdmin) {
    return { success: false, error: 'Acesso negado.' };
  }

  try {
    await deleteDoc(doc(db, LESSONS_COLLECTION, lessonId));
    return { success: true };
  } catch (e: any) {
    console.error('[academyService] Error deleting lesson:', e);
    return { success: false, error: e?.message || 'Erro ao excluir aula.' };
  }
}
