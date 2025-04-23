import { Low } from 'lowdb';
import { v4 as uuidv4 } from 'uuid';
import type { AIMessage } from '../types';

export type MessageWithMetaData = AIMessage & {
  id: string;
  createdAt: string;
};

export type Data = {
  messages: MessageWithMetaData[];
};

export interface Store {
  addMessages(messages: AIMessage[]): Promise<void>;
  getMessages(): Promise<AIMessage[]>;
}

export class InMemoryStore implements Store {
  private db: Low<Data>;

  constructor({ db }: { db: Low<Data> }) {
    this.db = db;
  }

  private addMetaData(message: AIMessage): MessageWithMetaData {
    return {
      ...message,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
  }

  private removeMetaData(message: MessageWithMetaData): AIMessage {
    const { id, createdAt, ...rest } = message;
    return rest;
  }

  async addMessages(messages: AIMessage[]): Promise<void> {
    this.db.data.messages.push(...messages.map(this.addMetaData));
    await this.db.write();
  }

  async getMessages(): Promise<AIMessage[]> {
    return this.db.data.messages.map(this.removeMetaData);
  }
}
