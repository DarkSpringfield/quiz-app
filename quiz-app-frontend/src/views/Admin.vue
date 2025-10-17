<template>
  <div class="min-h-screen flex items-center justify-center bg-brand-grayDark px-4">
    <div class="bg-brand-black rounded-2xl shadow p-6 md:p-10 w-full md:w-3/4 lg:w-2/3 text-center text-white">
      <h1 class="text-2xl md:text-3xl font-bold mb-6 text-brand-violet">
        Admin – {{ editingId ? 'Frage bearbeiten' : 'Neue Frage' }}
      </h1>

      <!-- Formular (wie gehabt) -->
      <form @submit.prevent="submitQuestion" class="space-y-4 text-left">
        <!-- Kategorie -->
        <div>
          <label class="block mb-1">Kategorie</label>
          <input v-model="category" class="w-full px-3 py-2 rounded bg-gray-800 text-white" />
        </div>
        <!-- Frage -->
        <div>
          <label class="block mb-1">Frage</label>
          <textarea v-model="frage" class="w-full px-3 py-2 rounded bg-gray-800 text-white"></textarea>
        </div>
        <!-- Optionen -->
        <div v-for="(opt, idx) in options" :key="idx">
          <label class="block mb-1">Antwort {{ idx + 1 }}</label>
          <input v-model="options[idx]" class="w-full px-3 py-2 rounded bg-gray-800 text-white" />
        </div>
        <!-- Index + Zeitlimit -->
        <div class="flex gap-4">
          <div class="flex-1">
            <label class="block mb-1">Index richtige Antwort (0-3)</label>
            <input
              v-model.number="correctIndex"
              type="number"
              min="0"
              max="3"
              class="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
          </div>
          <div class="flex-1">
            <label class="block mb-1">Zeitlimit (Sek.)</label>
            <input
              v-model.number="timeLimit"
              type="number"
              min="5"
              class="w-full px-3 py-2 rounded bg-gray-800 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full px-6 py-3 bg-brand-violet text-white text-lg rounded-lg shadow hover:bg-brand-violetDark transition"
        >
          {{ editingId ? 'Änderungen speichern' : 'Frage speichern' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          @click="cancelEdit"
          class="w-full mt-2 px-6 py-3 bg-gray-600 text-white text-lg rounded-lg shadow hover:bg-gray-700 transition"
        >
          Abbrechen
        </button>
      </form>

      <div v-if="success" class="mt-4 text-green-400">Aktion erfolgreich ✅</div>
      <div v-if="error" class="mt-4 text-red-400">Fehler: {{ error }}</div>

      <!-- Suche -->
      <div class="mt-10 mb-4 text-left">
        <input
          v-model="search"
          placeholder="Fragen durchsuchen…"
          class="w-full px-3 py-2 rounded bg-gray-800 text-white"
        />
      </div>

      <!-- Liste aller Fragen -->
      <div class="text-left">
        <h2 class="text-xl font-bold mb-4 text-brand-violet">Vorhandene Fragen</h2>
        <ul class="space-y-3 max-h-64 overflow-y-auto">
          <li
            v-for="q in paginatedQuestions"
            :key="q.id"
            class="bg-gray-800 p-3 rounded flex justify-between items-center"
          >
            <div>
              <div class="font-semibold">{{ q.category }}</div>
              <div>{{ q.text }}</div>
              <div class="text-sm text-gray-400">
                Zeitlimit: {{ q.timeLimit }}s – Richtige Antwort: {{ q.options[q.correctIndex] }}
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="editQuestion(q)"
                class="px-3 py-1 bg-brand-violet text-white rounded hover:bg-brand-violetDark"
              >
                Bearbeiten
              </button>
              <button
                @click="removeQuestion(q.id)"
                class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Löschen
              </button>
            </div>
          </li>
        </ul>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-4">
          <button
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            ‹ Zurück
          </button>
          <div>Seite {{ currentPage }} von {{ totalPages }}</div>
          <button
            :disabled="currentPage === totalPages"
            @click="currentPage++"
            class="px-3 py-1 bg-gray-700 text-white rounded disabled:opacity-40"
          >
            Weiter ›
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { addQuestion, fetchQuestions, deleteQuestion, updateQuestion } from '../services/api'

const category = ref('')
const frage = ref('')
const options = ref(['', '', '', ''])
const correctIndex = ref(0)
const timeLimit = ref(30)
const success = ref(false)
const error = ref('')
const questions = ref<any[]>([])
const editingId = ref<number | null>(null)

// Suche & Pagination
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(5) // Anzahl pro Seite

const filteredQuestions = computed(() => {
  const term = search.value.toLowerCase()
  return questions.value.filter(
    q =>
      q.frage.toLowerCase().includes(term) ||
      q.category.toLowerCase().includes(term)
  )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize.value)))

const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredQuestions.value.slice(start, start + pageSize.value)
})

async function loadQuestions() {
  try {
    questions.value = await fetchQuestions()
    currentPage.value = 1
  } catch (err: any) {
    error.value = err.message
  }
}

onMounted(loadQuestions())

async function submitQuestion() {
  success.value = false
  error.value = ''
  try {
    if (editingId.value) {
      await updateQuestion(editingId.value, {
        category: category.value,
        frage: frage.value,
        options: options.value,
        correctIndex: correctIndex.value,
        timeLimit: timeLimit.value
      })
    } else {
      await addQuestion({
        category: category.value,
        frage: frage.value,
        options: options.value,
        correctIndex: correctIndex.value,
        timeLimit: timeLimit.value
      })
    }
    success.value = true
    resetForm()
    await loadQuestions()
  } catch (err: any) {
    error.value = err.message
  }
}

function editQuestion(q: any) {
  editingId.value = q.id
  category.value = q.category
  frage.value = q.frage
  options.value = [...q.options]
  correctIndex.value = q.correctIndex
  timeLimit.value = q.timeLimit
}

function cancelEdit() {
  resetForm()
}

async function removeQuestion(id: number) {
  if (confirm('Frage wirklich löschen?')) {
    try {
      await deleteQuestion(id)
      await loadQuestions()
    } catch (err: any) {
      error.value = err.message
    }
  }
}

function resetForm() {
  editingId.value = null
  category.value = ''
  frage.value = ''
  options.value = ['', '', '', '']
  correctIndex.value = 0
  timeLimit.value = 30
}
</script>