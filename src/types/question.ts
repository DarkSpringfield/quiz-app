export interface Question {
    id: number
    category: String
    text: String
    options: String[]
    timeLimit: number
    correctIndex: number,
    explanation?: string
}