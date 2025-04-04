import type { Ova, OvaAPIResponse } from "@/inteface/ova";
import { cleanString } from "@/utils/clean-string";


export class OvaAdapter {
    private data: OvaAPIResponse[] = [];

    constructor(data: OvaAPIResponse[]) {
        this.data = data;
    }

    adapt(): Ova[] {
        return this.data.map((item) => {
            const parseGroup = cleanString(item.parentFolder)

            const mediaTags = Object.keys(item)
                .filter(key => item[key as keyof OvaAPIResponse] === true)
                .map(key => key.replace(/has/g, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase());

     
            return {
                id: item.id,
                title: item.name,
                tags: [parseGroup, ...mediaTags],
                group: parseGroup,
                imagePath: item.coverPath
            }
        });
    }
}