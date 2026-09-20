// MUDANÇA 1️⃣: Adicionar após linha ~133
// Procure por: const [formNewModuleBadge, setFormNewModuleBadge] = useState<string>('NOVO MÓDULO');
// E adicione DEPOIS:

const [savingLesson, setSavingLesson] = useState(false);
const [saveLessonError, setSaveLessonError] = useState<string | null>(null);


// ============================================================================
// MUDANÇA 2️⃣: Substituir handleSaveLesson (linha ~293)
// ============================================================================

const handleSaveLesson = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaveLessonError(null);
  setSavingLesson(true);

  try {
    const cleanId = extractYouTubeId(formLessonYoutubeUrl);

    if (!cleanId) {
      throw new Error('Por favor, informe um link ou ID válido do YouTube.');
    }

    if (!formLessonTitle.trim()) {
      throw new Error('Informe o título da videoaula.');
    }

    const takeawaysArray = formLessonKeyTakeaways
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    let lessonToSave: LessonItem;

    if (editingLessonId) {
      const existing = academyData.lessons.find((l) => l.id === editingLessonId);
      lessonToSave = {
        id: editingLessonId,
        title: formLessonTitle.trim(),
        moduleId: formLessonModuleId || academyData.modules[0]?.id || 'mod-1',
        youtubeUrlOrId: formLessonYoutubeUrl.trim(),
        youtubeId: cleanId,
        duration: formLessonDuration.trim() || '10:00',
        description: formLessonDescription.trim(),
        keyTakeaways: takeawaysArray,
        promptTemplate: formLessonPromptTemplate.trim(),
        materials: formLessonMaterials,
        order: existing?.order || academyData.lessons.length + 1,
        published: true,
        createdAt: existing?.createdAt || new Date().toISOString()
      };
    } else {
      lessonToSave = {
        id: 'les-' + Date.now(),
        moduleId: formLessonModuleId || academyData.modules[0]?.id || 'mod-1',
        title: formLessonTitle.trim(),
        duration: formLessonDuration.trim() || '10:00',
        youtubeUrlOrId: formLessonYoutubeUrl.trim(),
        youtubeId: cleanId,
        description: formLessonDescription.trim(),
        keyTakeaways: takeawaysArray,
        promptTemplate: formLessonPromptTemplate.trim(),
        materials: formLessonMaterials,
        order: academyData.lessons.length + 1,
        published: true,
        createdAt: new Date().toISOString()
      };
    }

    console.log('[📤 MembersAcademyView] Preparando aula para salvar:', {
      id: lessonToSave.id,
      title: lessonToSave.title,
      published: lessonToSave.published
    });

    await saveAcademyLessonToFirestore(lessonToSave);

    console.log('[✅ MembersAcademyView] Aula salva com sucesso!');

    alert('✅ Aula salva com sucesso! Os alunos já conseguem ver.');

    resetLessonForm();
    setIsManageModalOpen(false);
    setEditingLessonId(null);

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido';
    console.error('[❌ MembersAcademyView] Erro ao salvar aula:', errorMsg);
    setSaveLessonError(errorMsg);
    alert(`❌ Erro ao salvar aula:\n${errorMsg}`);
  } finally {
    setSavingLesson(false);
  }
};


// ============================================================================
// MUDANÇA 3️⃣: Adicionar no JSX antes de {/* Actions */} (linha ~1465)
// ============================================================================

{saveLessonError && (
  <div className="p-3 bg-[#EF4444]/20 border border-[#EF4444] rounded-lg text-[#EF4444] text-xs font-mono mb-4">
    <div className="font-bold mb-1">❌ Erro ao Salvar:</div>
    <div>{saveLessonError}</div>
  </div>
)}


// ============================================================================
// MUDANÇA 4️⃣: Substituir botão submit (linha ~1483)
// ============================================================================

<button
  type="submit"
  disabled={savingLesson}
  className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
    savingLesson
      ? 'bg-[#94A3B8] text-gray-800 opacity-50'
      : 'bg-[#F5C542] hover:bg-[#FFD95A] text-[#080808] shadow-lg shadow-[#F5C542]/20'
  }`}
>
  {savingLesson ? '⏳ Salvando no Firestore...' : editingLessonId ? 'Salvar Alterações' : '✅ Cadastrar Videoaula'}
</button>