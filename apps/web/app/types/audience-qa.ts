export interface AudienceQuestion {
  id: string;
  questionId: string; // Reference to the main Question
  text: string;
  authorName: string; // Could be anonymous or user name
  authorId?: string; // Optional if anonymous
  timestamp: Date;
  upvotes: number;
  isAnswered: boolean;
  isHidden?: boolean;
  replies: AudienceReply[];
}

export interface AudienceReply {
  id: string;
  audienceQuestionId: string;
  text: string;
  authorName: string; // Will be moderator name
  authorId: string; // Moderator ID
  timestamp: Date;
  isOfficial: boolean; // To mark official responses from moderators
}
