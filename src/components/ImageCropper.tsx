import React, { useState } from 'react'
// Här lägger vi till 'type' före Area för att fixa ditt fel
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
  
  const image = new Image()
  image.src = imageSrc
  await new Promise((resolve) => (image.onload = resolve))

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No 2d context')

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' })
      resolve(file)
    }, 'image/jpeg')
  })
}

interface CropModalProps {
  image: string
  onCropComplete: (croppedAreaPixels: Area) => void
  onCancel: () => void
}

export function CropModal({ image, onCropComplete, onCancel }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
 const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  return (
    <Dialog open={!!image} onOpenChange={onCancel}>
      <DialogContent className="max-w-[600px] h-[700px] flex flex-col p-0 overflow-hidden bg-white">
        <DialogHeader className="p-4 border-b text-black">
          <DialogTitle>Beskär din bild (3:2)</DialogTitle>
        </DialogHeader>
        
        <div className="relative flex-1 bg-[#333]">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={3 / 4} // Ändrat till 3/2 som du bad om
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          />
        </div>

        <div className="p-4 bg-white space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-gray-500">ZOOM</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={onCancel} className="flex-1 text-black border-gray-300">Avbryt</Button>
            <Button 
              onClick={() => croppedAreaPixels && onCropComplete(croppedAreaPixels)} 
              className="flex-1 bg-brand-500 text-white hover:bg-brand-600"
            >
              Spara beskärning
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
