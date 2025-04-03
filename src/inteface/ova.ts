

export interface Ova {
    id: string
    title: string
    group: string
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