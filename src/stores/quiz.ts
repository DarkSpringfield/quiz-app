import { defineStore } from "pinia";
import { fetchQuestions, saveResult, type Question } from "../services/api";

export const useQuizStore = defineStore('quiz', {
    state: () => ({
        allQuestions: [] as Question[],
        questions: [] as Question[],
        currentIndex: 0,
        score: 0,
        username: '',
    }),
    getters: {
      currentQuestion: (state) => state.questions[state.currentIndex],
      categories: (state) => ['Alle', ...new Set(state.allQuestions.map(q => q.category))]
    },
    actions: {
      async loadFromApi() {
        this.allQuestions = await fetchQuestions()
        this.questions = this.allQuestions
        this.currentIndex = 0
        this.score
      },
      filterByCategory(cat: string) {
        if(cat === 'Alle') {
          this.questions = this.allQuestions
        } else {
          this.questions = this.allQuestions.filter(q => q.category === cat) 
        }
        this.currentIndex = 0;
      },
      answer(i: number) {
        if(this.currentQuestion && i === this.currentQuestion.correctIndex) {
          this.score++
        }
        this.currentIndex++
      },
      async submitResult() {
        if(this.username) {
          await saveResult(this.username, this.score)
        }
      },
      reset() {
        this.questions = []
        this.currentIndex = 0;
        this.score = 0;
      }
    }
})