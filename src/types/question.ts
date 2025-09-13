export interface Question {
    id: number
    text: String
    options: String[]
    correctIndex: number,
    explanation?: string
}