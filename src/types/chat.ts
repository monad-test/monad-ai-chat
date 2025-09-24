export interface ChatMessage {
  role: "user" | "ai";
  text: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
}
