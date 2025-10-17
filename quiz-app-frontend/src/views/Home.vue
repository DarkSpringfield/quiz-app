<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-grayDark px-4">
    <div class="flex flex-col items-center w-full md:w-2/3 lg:w-1/2">
      <h1 class="text-3xl md:text-4xl font-bold mb-6 text-brand-violet">
        Willkommen beim Quiz
      </h1>

      <div class="mb-4 w-full">
        <label for="category" class="block text-sm font-medium mb-1 text-white">
          Kategorie auswählen:
        </label>
        <select
          id="category"
          v-model="selected"
          @change="onCategoryChange"
          class="px-6 py-3 w-full rounded-lg border-gray-600 bg-brand-black text-white focus:border-brand-violet focus:ring-brand-violet"
        >
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
      </div>

      <button
        @click="startQuiz"
        class="px-6 py-3 bg-brand-violet text-white text-lg rounded-lg shadow hover:bg-brand-violetDark transition"
      >
        Quiz starten
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuizStore } from '../stores/quiz'

const quiz = useQuizStore()
const router = useRouter()
const selected = ref('Alle')

onMounted(async () => {
  await quiz.loadFromApi()
})

const categories = quiz.categories

function onCategoryChange() {
  quiz.filterByCategory(selected.value)
}

function startQuiz() {
  console.log("Das Quiz wird gestartet");
  router.push('/quiz')
}
</script>
