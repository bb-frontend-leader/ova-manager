

export interface Ova {
    id: string
    title: string
    group: string
    tags: string[]
    ovaPath: string
    imagePath: string
}

export interface OvaAPIResponse {
    id: string
    name: string
    coverPath: string
    ovaPath: {
        server: string;
        local: string;
    };
    parentFolder: string
    hasAudio: boolean
    hasAudioDescription: boolean
    hasVideo: boolean
    hasSubtitles: boolean
    hasVideoSignLanguage: boolean
}

export type FilterType = {
    name: string;
    options: string[];
}
