import { OvaAdapter } from "@/adapters/ova-adapter";
import type { Ova, OvaAPIResponse } from "@/inteface/ova";


export class OvaService {
    private ApiURL: string;

    constructor(ApiURL: string) {
        this.ApiURL = ApiURL;
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

}