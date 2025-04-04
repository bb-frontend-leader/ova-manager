

export interface Ova {
    id: string
    title: string
    group: string
    tags: string[]
    imagePath: string
}

export interface OvaAPIResponse {
    id: string
    name: string
    coverPath: string
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
