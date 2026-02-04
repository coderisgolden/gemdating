import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Check, Sparkles, Upload, X } from 'lucide-react'
// VIKTIGT: Vi importerar verktygen från din andra fil
import { CropModal, getCroppedImg } from '@/components/ImageCropper'
import type { Area } from 'react-easy-crop'

type PhotoUploadStepProps = {
  files: File[]
  onFilesSelected: (files: File[]) => void
  onSave: () => void
  onBack: () => void
  onUpgrade?: () => void
  onRemoveFile: (index: number) => void
}

export function PhotoUploadStep({
  files,
  onFilesSelected,
  onSave,
  onBack,
  onUpgrade,
  onRemoveFile,
}: PhotoUploadStepProps) {
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      reader.onload = () => setSelectedImage(reader.result as string)
      reader.readAsDataURL(e.target.files[0]) // Vi tar en i taget för att kunna beskära
      setError(null)
    }
  }

  const handleCropDone = async (pixels: Area) => {
    if (selectedImage) {
      try {
        const croppedFile = await getCroppedImg(selectedImage, pixels)
        onFilesSelected([...files, croppedFile])
        setSelectedImage(null)
      } catch (err) {
        setError("Kunde inte spara den beskurna bilden.")
      }
    }
  }

  return (
    <OnboardingLayout
      title="Add your photos"
      subtitle="Upload at least one photo to complete your profile"
      onNext={() => files.length > 0 ? onSave() : setError('Ladda upp minst en bild')}
      onBack={onBack}
      nextLabel="Save and upload"
    >
      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 text-black">
          <Label className="text-lg font-semibold mb-4 block text-gray-700">Ladda upp bilder (3:2 format)</Label>

          <div className="border-2 border-dashed border-pink-200 rounded-2xl p-8 text-center bg-pink-50/30 hover:bg-pink-50/50 transition-colors cursor-pointer relative">
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            
            {/* Bild-galleri */}
            {files.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {files.map((file, index) => (
                  <div key={index} className="relative aspect-[3/2] rounded-lg overflow-hidden border-2 border-white shadow-md">
                    <img src={URL.createObjectURL(file)} className="object-cover w-full h-full" alt="Preview" />
                    <button 
                       onClick={(e) => { e.preventDefault(); onRemoveFile(index); }}
                       className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label htmlFor="photo-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-pink-500" />
                </div>
                <p className="font-medium text-gray-700">Klicka för att välja bild</p>
                <p className="text-xs text-gray-400 mt-1">PNG eller JPG</p>
              </div>
            </label>
          </div>
        </div>

        {/* GUIDELINES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 text-black">
          <div className="space-y-3">
             <div className="flex items-center gap-2"><Check className="text-green-500" size={18} /> <span className="text-sm">Använd bilder med bra ljus</span></div>
             <div className="flex items-center gap-2"><Check className="text-green-500" size={18} /> <span className="text-sm">3:2 format rekommenderas</span></div>
          </div>
        </div>

        {/* MODALEN SOM ÖPPNAS VID VAL AV BILD */}
        {selectedImage && (
          <CropModal 
            image={selectedImage} 
            onCropComplete={handleCropDone} 
            onCancel={() => setSelectedImage(null)} 
          />
        )}

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      </div>
    </OnboardingLayout>
  )
}
