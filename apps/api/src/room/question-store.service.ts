import { Injectable } from '@nestjs/common';

interface Question {
  id: string;
  userId: string;
  roomId: string;
  question: string;
  answer?: string;
  timestamp: number;
}

@Injectable()
export class QuestionStoreService {
  private questions: Record<string, Question[]> = {}; // roomId -> questions[]

  addQuestion(roomId: string, question: Question) {
    if (!this.questions[roomId]) this.questions[roomId] = [];
    this.questions[roomId].push(question);
  }

  getQuestions(roomId: string): Question[] {
    return this.questions[roomId] || [];
  }

  answerQuestion(roomId: string, questionId: string, answer: string): Question | null {
    const roomQuestions = this.questions[roomId];
    if (!roomQuestions) return null;

    const q = roomQuestions.find(q => q.id === questionId);
    if (!q) return null;

    q.answer = answer;
    return q;
  }
}
