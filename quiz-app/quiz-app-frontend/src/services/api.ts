export interface Question {
    id: number,
    category: string,
    frage: string,
    options: string[]
    correctIndex: number,
    timeLimit: number
}

const API_URL = 'http://localhost:3000';

export async function fetchQuestions(): Promise<Question[]> {
    const result = await fetch(`${API_URL}/questions`);
    if(!result.ok) {
        throw new Error('Fehler beim Laden der Fragen');
    }
    return result.json();
}

export async function saveResult(username: string, score: number) {
    const result = await fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, score}),
    });
    if(!result.ok) {
        throw new Error('Fehler beim Speichern des Ergebnisses');
    }
    return result.json();
}

export async function addQuestion(question: {
        category: string,
        frage: string,
        options: string[]
        correctIndex: number,
        timeLimit: number
    }) {
    const result = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),

    });
    if(!result.ok) {
        throw new Error('Fehler beim Hinzufügen der Frage');
    }
    return result.json();
}

export async function deleteQuestion(id: number) {
    const result = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
    });
    if(!result.ok) {
        throw new Error('Fehler beim Löschen der Frage');
    }
    return result.json();
}

export async function updateQuestion(id: number, question: any) {
    const result = await fetch(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(question),
    });
    if(!result.ok) {
        throw new Error('Fehler beim Aktualisieren der Frage');
    }
    return result.json();
}