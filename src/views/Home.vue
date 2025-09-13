<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
    <div class="flex flex-col items-center w-full md:w-2/3 lg:w-1/2">
      <h1 class="text-3xl md:text-4xl font-bold mb-6">Willkommen beim Quiz</h1>

      <div class="mb-4 w-full">
        <label for="category" class="block text-sm font-medium mb-1">Kategorie auswählen:</label>
        <select id="category" v-model="selected" @change="onCategoryChange"
          class="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
      </div>

      <button @click="startQuiz"
        class="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700 transition">
        Quiz starten
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'
import type { Question } from '../types/question'

const quiz = useQuizStore()
const router = useRouter()
const selected = ref('Alle')

onMounted(() => {
  if (quiz.allQuestions.length === 0) {
    const sample: Question[] = [
      { id: 1, category: 'Mathe', text: 'Was ist 2+2?', options: ['3','4','5'], correctIndex: 1, timeLimit: 10 },
      { id: 2, category: 'Technik', text: 'Welche Sprache ist typsicher?', options: ['HTML','CSS','TypeScript'], correctIndex: 2, timeLimit: 15 },
      { id: 3, category: 'Mathe', text: 'Was ist 5*5?', options: ['20','25','30'], correctIndex: 1, timeLimit: 10 },
    ]
    quiz.loadQuestions(sample)
  }
})

const categories = quiz.categories

function onCategoryChange() {
  quiz.filterByCategory(selected.value)
}

function startQuiz() {
  router.push('/quiz')
}
</script>
