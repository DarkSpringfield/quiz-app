import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Question } from '../types/question'

export const useQuizStore = defineStore('quiz', () => {
  const allQuestions = ref<Question[]>([])
  const questions = ref<Question[]>([]) // aktuell gefilterte
  const currentIndex = ref(0)
  const score = ref(0)
  const selectedCategory = ref<string>('Alle')

  const currentQuestion = computed(() => questions.value[currentIndex.value])

  function loadQuestions(qs: Question[]) {
    allQuestions.value = qs
    questions.value = qs
    currentIndex.value = 0
    score.value = 0
  }

  function filterByCategory(cat: string) {
    selectedCategory.value = cat
    if (cat === 'Alle') {
      questions.value = allQuestions.value
    } else {
      questions.value = allQuestions.value.filter((q: any) => q.category === cat)
    }
    currentIndex.value = 0
    score.value = 0
  }

  function answer(choiceIndex: number) {
    if (!currentQuestion.value) return
    if (currentQuestion.value.correctIndex === choiceIndex) score.value++
    currentIndex.value++
  }

  function reset() {
    currentIndex.value = 0
    score.value = 0
  }

  const categories = computed(() => {
    const cats = new Set(allQuestions.value.map((q: any)=> q.category))
    return ['Alle', ...cats]
  })

  return {
    allQuestions,
    questions,
    currentIndex,
    score,
    selectedCategory,
    currentQuestion,
    categories,
    loadQuestions,
    filterByCategory,
    answer,
    reset,
  }
})