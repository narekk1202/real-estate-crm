import { MUTATION_KEYS } from '#/constants/request-keys'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { client } from '../api'

export type ImageUploadInput = { file: File; folder?: string }
export type MultiImageUploadInput = { files: File[]; folder: string }

async function uploadSingle({
  file,
  folder,
}: ImageUploadInput): Promise<string> {
  const result = await client.api.storage.presign.$post({
    json: { filename: file.name, contentType: file.type, folder },
  })
  if (!result.ok) throw new Error('Failed to get presigned URL')

  const { uploadUrl, publicUrl } = await result.json()

  const r2Response = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!r2Response.ok) throw new Error(`R2 upload failed: ${r2Response.status}`)

  return publicUrl
}

export type UploadProgress = {
  total: number
  completed: number
  urls: string[]
}

export const useImageUpload = (
  onProgress?: (progress: UploadProgress) => void,
) => {
  return useMutation({
    mutationKey: [MUTATION_KEYS.IMAGE_UPLOAD],
    mutationFn: async ({
      files,
      folder,
    }: MultiImageUploadInput): Promise<string[]> => {
      const urls: string[] = []

      for (const [i, file] of files.entries()) {
        const url = await uploadSingle({ file, folder })
        urls.push(url)
        onProgress?.({ total: files.length, completed: i + 1, urls: [...urls] })
      }

      return urls
    },
    onError: (error) => {
      console.error('Image upload failed:', error)
      toast.error('Image upload failed. Please try again.')
    },
  })
}
