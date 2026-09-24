import { OvaAdapter } from '@/adapters/ova-adapter';
import type { Ova, OvaAPIResponse } from '@/types/ova';

class OvaService {
  private ApiURL: string;
  private static instance: OvaService | null = null;

  private constructor() {
    this.ApiURL = import.meta.env.VITE_PUBLIC_API_URL;
  }

  public static getInstance(): OvaService {
    if (!OvaService.instance) {
      OvaService.instance = new OvaService();
    }
    return OvaService.instance;
  }

  async fetchOvas(): Promise<{ message: string; data: Ova[] }> {
    try {
      const response = await fetch(this.ApiURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const rawData: OvaAPIResponse[] = await response.json();
      const dataAdapter = new OvaAdapter(rawData);

      return {
        message: 'Data fetched successfully',
        data: dataAdapter.adapt()
      };
    } catch (error) {
      console.error('Error fetching data from API:', error);
      throw error instanceof Error ? error : new Error('Error fetching data from API');
    }
  }

  async fetchOvaGroups(): Promise<{ message: string; data: string[] }> {
    try {
      const response = await fetch(`${this.ApiURL}/groups`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: string[] = await response.json();

      return {
        message: 'Data fetched successfully',
        data: data
      };
    } catch (error) {
      console.error('Error fetching groups from API:', error);
      throw error instanceof Error ? error : new Error('Error fetching groups from API');
    }
  }

  // The ZIP is streamed by the API, so it is downloaded by the browser itself instead of through fetch()
  getOvaZipUrl(id: string): string {
    return `${this.ApiURL}/zip/${id}`;
  }
}

const ovaService = OvaService.getInstance();

export default ovaService;
