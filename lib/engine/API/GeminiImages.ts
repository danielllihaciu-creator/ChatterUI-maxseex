import { Directory, File, Paths } from 'expo-file-system'

import { Logger } from '@lib/state/Logger'

const GENERATED_DIR = `${Paths.document.uri}generated/`
export const GENERATED_IMAGE_ALT = 'Generated image'

const extFromMime = (mime: string) => {
    const sub = mime.split('/')[1]?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''
    if (!sub || sub === 'jpeg') return 'jpg'
    return sub
}

/** Saves a base64 image to disk and returns its file:// uri */
export const saveGeneratedImage = (base64: string, mimeType: string): string | undefined => {
    try {
        const dir = new Directory(GENERATED_DIR)
        if (!dir.exists) dir.create({ idempotent: true })
        const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extFromMime(mimeType)}`
        const file = new File(dir, name)
        file.write(base64, { encoding: 'base64' })
        return GENERATED_DIR + name
    } catch (e) {
        Logger.error('Failed to save generated image: ' + e)
        return undefined
    }
}

export const toImageMarkdown = (uri: string) => `\n\n![${GENERATED_IMAGE_ALT}](${uri})\n\n`

export const isGeneratedImageChunk = (text: string) =>
    text.trimStart().startsWith(`![${GENERATED_IMAGE_ALT}](`)

/** Replaces generated image markdown with a short placeholder so file paths are not sent as context */
export const stripGeneratedImages = (text: string) =>
    text.replace(/!\[Generated image\]\([^)]*\)/g, '[Generated image]')
