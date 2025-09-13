<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
    <div class="bg-white rounded-2xl shadow p-6 md:p-10 w-full md:w-2/3 lg:w-1/2 text-center">
      <h1 class="text-2xl md:text-3xl font-bold mb-6">Ergebnis</h1>
      <p class="mb-8 text-lg">
        Du hast <span class="font-semibold">{{ quiz.score }}</span>
        von {{ quiz.questions.length }} Fragen richtig beantwortet.
      </p>
      <button @click="restart"
        class="px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow hover:bg-green-700 transition">
        Zurück zur Startseite
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const quiz = useQuizStore()
const router = useRouter()

function restart() {
  quiz.reset()
  router.push('/')
}
</script>
