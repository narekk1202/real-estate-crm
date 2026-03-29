import { Button } from '@/components/ui/button'
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from '@/components/ui/file-upload'
import { Image, X } from 'lucide-react'
import * as React from 'react'
import { useCallback } from 'react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
}

function ImageUploader({ files, onFilesChange }: Readonly<ImageUploaderProps>) {
  const onFileValidate = React.useCallback(
    (file: File): string | null => {
      if (files.length >= 5) {
        return 'You can only upload up to 5 files'
      }

      if (!file.type.startsWith('image/')) {
        return 'Only image files are allowed'
      }

      const MAX_SIZE = 2 * 1024 * 1024 // 2MB
      if (file.size > MAX_SIZE) {
        return `File size must be less than ${MAX_SIZE / (1024 * 1024)}MB`
      }

      return null
    },
    [files],
  )

  const onFileReject = useCallback((file: File, message: string) => {
    const truncatedName =
      file.name.length > 20 ? `${file.name.slice(0, 17)}...` : file.name
    toast.error(message, {
      description: `"${truncatedName}" has been rejected`,
      descriptionClassName: 'text-muted-foreground!',
    })
  }, [])

  return (
    <FileUpload
      value={files}
      onValueChange={onFilesChange}
      onFileValidate={onFileValidate}
      onFileReject={onFileReject}
      accept="image/*"
      maxFiles={5}
      className="w-full max-w-md"
      multiple
    >
      <FileUploadDropzone>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Image className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Property Images</p>
          <p className="text-muted-foreground text-xs text-center">
            Drag & drop files here or click to browse (Up to 5 images, max 2MB
            each)
          </p>
        </div>
        <FileUploadTrigger asChild>
          <Button variant="outline" size="sm" className="mt-2 w-fit">
            Browse images
          </Button>
        </FileUploadTrigger>
      </FileUploadDropzone>
      <FileUploadList>
        {files.map((file) => (
          <FileUploadItem key={file.name} value={file}>
            <FileUploadItemPreview />
            <FileUploadItemMetadata />
            <FileUploadItemDelete asChild>
              <Button variant="ghost" size="icon" className="size-7">
                <X />
              </Button>
            </FileUploadItemDelete>
          </FileUploadItem>
        ))}
      </FileUploadList>
    </FileUpload>
  )
}

export default ImageUploader
