import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import {
  Heart,
  Upload,
  ImagePlus,
  Check,
  Sparkles,
  Save,
} from 'lucide-react'

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

  // 
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;
  
  const newFiles = Array.from(e.target.files);
  // Lägg till de nya filerna till de befintliga istället för att ersätta
  onFilesSelected([...files, ...newFiles]); 
  setError(null);
};


  const handleNext = () => {
    if (files.length === 0) {
      setError('Please upload at least one photo')
      return
    }

    setError(null)
    onSave()
  }

  return (
    <OnboardingLayout
      title="Add your photos"
      subtitle="Upload at least one photo to complete your profile"
      onNext={handleNext}
      onBack={onBack}
      nextLabel="Save and upload"
    >
      <div
        className={[
          'space-y-6',
          error ? 'animate-shake' : '',
        ].join(' ')}
      >
        {/* Upload */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <Label
            htmlFor="photo-upload"
            className="text-lg font-semibold text-gray-700 mb-4 block"
          >
            Upload Your Photos
          </Label>

          <div className="border-2 border-dashed border-brand-200 rounded-2xl p-8 text-center bg-pink-50/30 hover:bg-pink-50/50 transition-colors cursor-pointer">
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Selected Photos Preview */}

{/* Selected Photos Preview */}
{files.length > 0 && (
  <div className="grid grid-cols-3 gap-2 mt-4">
    {files.map((file, index) => ( // Använd index här
      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
        <img 
          src={URL.createObjectURL(file)} 
          alt="preview" 
          className="object-cover w-full h-full" 
        />
        
        {/* Ta bort-knapp */}
        <button
          onClick={() => onRemoveFile(index)}
          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-lg hover:bg-red-700 transition"
          aria-label="Remove photo"
        >
          {/* Använd en liten kryss-ikon, t.ex. X från lucide-react */}
          <svg xmlns="http://www.w3.org" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    ))}
  </div>
)}


            <label htmlFor="photo-upload" className="cursor-pointer block">
              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-10 h-10 text-brand-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Click to upload or drag and drop
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  PNG, JPG or JPEG (max. 5MB each)
                </p>
                {/* <Button
                  type="button"
                  className="bg-brand-500 hover:bg-brand-600 text-white rounded-full px-6 shadow-md"
                >
                  <ImagePlus className="w-4 h-4 mr-2" />
                  Choose Photos
                </Button> */}
                <div className="text-sm text-gray-400">
                  <h3>Recommended: At least 3 photos for best results</h3>
                </div>


              </div>
            </label>
          </div>

          {files.length > 0 && (
            <p className="mt-4 text-sm text-gray-600">
              {files.length} photo(s) selected
            </p>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <Label className="text-lg font-semibold text-gray-700 mb-4 block">
            Photo Guidelines
          </Label>

          <div className="space-y-3">
            {[
              'Upload at least 3 clear photos of yourself',
              'Show your genuine smile and personality',
              'Ensure good lighting and high quality images',
              'Avoid group photos or heavily filtered images',
            ].map((text) => (
              <div key={text} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-brand-100 rounded-full flex items-center justify-center mt-0.5">
                  <Check className="w-4 h-4 text-brand-600" />
                </div>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium */}
        <div className="bg-linear-to-r from-brand-500 to-rose-400 rounded-2xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg">
                  Premium Features
                </h4>
                <p className="text-sm text-pink-100">
                  Unlimited photo uploads & priority visibility
                </p>
              </div>
            </div>

            {onUpgrade && (
              <Button
                type="button"
                onClick={onUpgrade}
                className="bg-white text-brand-600 hover:bg-brand-50 rounded-full px-6 shadow-md font-semibold"
              >
                Upgrade Now
              </Button>
            )}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center animate-fade">
            {error}
          </p>
        )}
      </div>
    </OnboardingLayout>
  )
}
