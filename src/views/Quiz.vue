<template>
  <div v-if="question" class="min-h-screen flex items-center justify-center bg-white px-4">
    <div class="flex flex-col items-center w-full md:w-2/3 lg:w-1/2">
      <!-- Frage + Timer -->
      <div class="bg-gray-50 rounded-2xl shadow p-6 w-full text-center mb-6">
        <h2 class="text-2xl md:text-3xl font-semibold mb-2">{{ question.text }}</h2>
        <p class="text-sm md:text-base text-gray-500 mb-4">Kategorie: {{ question.category }}</p>

        <div class="w-full bg-gray-200 rounded-full h-2 md:h-3 mb-1">
          <div class="bg-blue-500 h-2 md:h-3 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
        </div>
        <p class="text-right text-xs mt-1">Zeit übrig: {{ timeLeft }} s</p>
      </div>

      <!-- Antworten -->
      <div class="bg-gray-50 rounded-2xl shadow p-6 w-full">
        <ul class="space-y-3 md:space-y-4">
          <li v-for="(opt, i) in question.options" :key="i">
            <button @click="select(i)"
              class="w-full text-left px-4 py-3 md:py-4 bg-white border rounded-lg hover:bg-blue-50 text-base md:text-lg">
              {{ opt }}
            </button>
          </li>
        </ul>
        <p class="text-center text-sm text-gray-500 mt-6">
          Frage {{ quiz.currentIndex + 1 }} / {{ quiz.questions.length }}
        </p>
      </div>
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-gray-500">Keine Fragen (mehr) vorhanden.</p>
  </div>
</template>



<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const quiz = useQuizStore()
const router = useRouter()

const question = computed(() => quiz.currentQuestion)
const timeLeft = ref(0)
let timer: number | undefined

const progress = computed(() => {
  if (!question.value) return 0
  const total = question.value.timeLimit ?? 15
  return (timeLeft.value / total) * 100
})

function startTimer() {
  timeLeft.value = question.value?.timeLimit ?? 15
  clearInterval(timer)
  timer = window.setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) nextQuestion()
  }, 1000)
}

function select(i: number) {
  quiz.answer(i)
  nextQuestion()
}

function nextQuestion() {
  clearInterval(timer)
  if (quiz.currentIndex >= quiz.questions.length) router.push('/results')
  else startTimer()
}

watch(question, () => {
  if (question.value) startTimer()
})

onMounted(() => {
  if (!question.value) router.push('/')
  else startTimer()
})

onBeforeUnmount(() => clearInterval(timer))
</script>
