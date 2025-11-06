import { apiClient } from '../lib/api-client';

export interface Sentence {
  id: string;
  text: string;
}

export interface SentencesResponse {
  success: boolean;
  sentences: Sentence[];
}

export interface SentenceResponse {
  success: boolean;
  sentence: Sentence;
}

export interface ApiResponse {
  success: boolean;
}

class SentencesService {
  async getSentences(): Promise<Sentence[]> {
    try {
      const response = await apiClient.get<SentencesResponse>('/sentences');
      if (response.success && response.sentences) {
        return response.sentences;
      }
      return [];
    } catch (error) {
      console.error('Failed to get sentences:', error);
      return [];
    }
  }

  async saveSentences(sentences: Sentence[]): Promise<boolean> {
    try {
      for (const sentence of sentences) {
        await apiClient.post<SentenceResponse>('/sentences', sentence);
      }
      return true;
    } catch (error) {
      console.error('Failed to save sentences:', error);
      return false;
    }
  }

  async addSentence(sentence: Sentence): Promise<boolean> {
    try {
      await apiClient.post<SentenceResponse>('/sentences', sentence);
      return true;
    } catch (error) {
      console.error('Failed to add sentence:', error);
      return false;
    }
  }

  async updateSentence(id: string, text: string): Promise<boolean> {
    try {
      await apiClient.put<SentenceResponse>(`/sentences/${id}`, { text });
      return true;
    } catch (error) {
      console.error('Failed to update sentence:', error);
      return false;
    }
  }

  async deleteSentence(id: string): Promise<boolean> {
    try {
      await apiClient.delete<ApiResponse>(`/sentences/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete sentence:', error);
      return false;
    }
  }

  async reorderSentences(sentences: Sentence[]): Promise<boolean> {
    try {
      await apiClient.put<ApiResponse>('/sentences/reorder', { sentences });
      return true;
    } catch (error) {
      console.error('Failed to reorder sentences:', error);
      return false;
    }
  }
}

export const sentencesService = new SentencesService();
