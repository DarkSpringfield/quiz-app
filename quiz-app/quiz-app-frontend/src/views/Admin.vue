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
              <div>{{ q.frage }}</div>
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
import { ref, computed, onMounted, watch } from 'vue'
import {
  addQuestion,
  fetchQuestions,
  deleteQuestion,
  updateQuestion,
} from '../services/api'

// Formular-States
const category = ref('')
const frage = ref('')
const options = ref(['', '', '', ''])
const correctIndex = ref(0)
const timeLimit = ref(30)
const success = ref(false)
const error = ref('')

// Daten / Edit-State
const questions = ref<any[]>([])
const editingId = ref<number | null>(null)

// Suche & Pagination
const search = ref('')
const currentPage = ref(1)
const pageSize = ref(5) // items pro Seite

// --- Hilfs-Funktion: sichere Normalisierung eines Frage-Objekts ---
// Manche Antworten/Backends liefern `text`, andere `frage` etc.
// Wir machen daraus immer eine einheitliche Form.
function normalizeQuestion(raw: any) {
  return {
    id: raw.id ?? raw.ID ?? raw.id_question ?? null,
    category: raw.category ?? raw.kategorie ?? '',
    // unterstütze sowohl 'text' als auch 'frage' als Feldname
    frage: (raw.text ?? raw.frage ?? raw.question ?? '').toString(),
    options: Array.isArray(raw.options) ? raw.options : (raw.options ? JSON.parse(raw.options) : []),
    correctIndex: raw.correctIndex ?? raw.correct_index ?? raw.correct ?? 0,
    timeLimit: raw.timeLimit ?? raw.time_limit ?? raw.time ?? 15,
    // falls weitere Felder nötig: raw.meta etc.
  }
}

// --- Laden der Fragen ---
async function loadQuestions() {
  success.value = false
  error.value = ''
  try {
    const res = await fetchQuestions()
    // Debug: was kommt wirklich vom API-Call?
    console.log('API response for fetchQuestions():', res)

    // Falls API ein { data: [...] } zurückgibt, entpacken
    const arr = Array.isArray(res) ? res : (res.data && Array.isArray(res.data) ? res.data : [])

    // Normalisieren und in reactive array schreiben
    questions.value = arr.map(normalizeQuestion)
    console.log('normalized questions:', questions.value)

    // reset pagination
    currentPage.value = 1
  } catch (err: any) {
    error.value = err?.message ?? String(err)
    console.error('loadQuestions error:', err)
  }
}

// wichtig: onMounted mit Funktionsreferenz (nicht mit Aufruf!)
onMounted(loadQuestions)

// --- Filter / Pagination (robust gegen undefined) ---
const filteredQuestions = computed(() => {
  const term = (search.value ?? '').toString().trim().toLowerCase()
  if (!term) return questions.value

  // sichere Filter-Funktion: prüft Felder vor Aufruf von toLowerCase
  return questions.value.filter(q => {
    const txt = (q.text ?? '').toString().toLowerCase()
    const cat = (q.category ?? '').toString().toLowerCase()
    return txt.includes(term) || cat.includes(term)
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredQuestions.value.length / pageSize.value)))

const paginatedQuestions = computed(() => {
  // clamp currentPage
  const cp = Math.min(Math.max(1, currentPage.value), totalPages.value)
  const start = (cp - 1) * pageSize.value
  return filteredQuestions.value.slice(start, start + pageSize.value)
})

// Wenn sich filteredQuestions ändert, stelle sicher, dass currentPage <= totalPages
watch(filteredQuestions, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

// Wenn search geändert wird, zurück auf Seite 1
watch(search, () => {
  currentPage.value = 1
})

// --- CRUD Aktionen (verwenden API-Wrapper) ---
async function submitQuestion() {
  success.value = false
  error.value = ''
  try {
    const payload = {
      category: category.value,
      // API erwartet möglicherweise 'text' statt 'frage' — sende 'text'
      frage: frage.value,
      options: options.value,
      correctIndex: correctIndex.value,
      timeLimit: timeLimit.value,
    }

    if (editingId.value) {
      await updateQuestion(editingId.value, payload)
    } else {
      await addQuestion(payload)
    }

    success.value = true
    resetForm()
    await loadQuestions()
  } catch (err: any) {
    error.value = err?.message ?? String(err)
    console.error('submitQuestion error:', err)
  }
}

function editQuestion(q: any) {
  editingId.value = q.id
  category.value = q.category
  frage.value = q.text
  options.value = Array.isArray(q.options) ? [...q.options] : ['', '', '', '']
  correctIndex.value = q.correctIndex ?? 0
  timeLimit.value = q.timeLimit ?? 30
}

function cancelEdit() {
  resetForm()
}

async function removeQuestion(id: number) {
  if (!confirm('Frage wirklich löschen?')) return
  try {
    await deleteQuestion(id)
    await loadQuestions()
  } catch (err: any) {
    error.value = err?.message ?? String(err)
    console.error('removeQuestion error:', err)
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