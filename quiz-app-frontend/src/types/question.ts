export interface Question {
    id: number
    category: String
    frage: String
    options: String[]
    timeLimit: number
    correctIndex: number
    explanation?: string
    points?: number
}