import { OvaAdapter } from "@/adapters/ova-adapter";
import type { Ova, OvaAPIResponse } from "@/inteface/ova";


class OvaService {
    private ApiURL: string;
    static instance: OvaService | null = null;

    constructor(ApiURL: string) {
        this.ApiURL = ApiURL;
    }

    public static getInstance(ApiURL: string): OvaService {
        if (!OvaService.instance) {
            OvaService.instance = new OvaService(ApiURL);
        }
        return OvaService.instance;
    }

    async fetchOvas(): Promise<{ success: true; data: Ova[] } | { success: false; message: string }> {
        try {
            const response = await fetch(this.ApiURL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const rawData: OvaAPIResponse[] = await response.json();
            const dataAdapter = new OvaAdapter(rawData);

            return {
                success: true,
                data: dataAdapter.adapt()
            };
        } catch (error) {
            console.error("Error fetching data from API:", error);
            return {
                success: false,
                message: "Error fetching data from API",
            }
        }
    }

    async fetchOvaGroups(): Promise<string[]> {
        const response = await fetch(`${this.ApiURL}/groups`);
        const data: string[] = await response.json();

        return data
    }

    async fetchOvaZip(id: string): Promise<{ success: true; data: string } | { success: false; message: string }> {
        try {
            const response = await fetch(`${this.ApiURL}/zip/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
    
            return {
                success: true,
                data: url,
            };
        } catch (error) {
            console.error("Error fetching data from API:", error);
            return {
                success: false,
                message: "Error fetching data from API",
            }
        }
    }

}

const ovaService = OvaService.getInstance(import.meta.env.PUBLIC_API_URL);

export default ovaService;