import type { Ova, OvaAPIResponse } from "@/inteface/ova";


export class OvaAdapter {
    private data: OvaAPIResponse[] = [];

    constructor(data: OvaAPIResponse[]) {
        this.data = data;
    }

    adapt(): Ova[] {
        return this.data.map((item) => ({
            id: item.id,
            title: item.name,
            group: item.parentFolder,
            imagePath: item.coverPath
        }));
    }
}