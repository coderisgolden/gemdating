import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from "@/context/AuthContext"
import { OnboardingStep } from './steps'
import { OnboardingProgress } from '@/features/onboarding/components/OnboardingProgress'

import type { OnboardingData } from './types'

import { InterestsStep } from './steps/InterestsStep'
import { AboutYouStep } from './steps/AboutYouStep'
import { MatchPreferencesV2Step } from './steps/MatchPreferencesV2Step'
import { DealbreakersLifestyleStep } from './steps/DealbreakersLifestyleStep'
import { PhotoUploadStep } from './steps/PhotoUploadStep'

import { INTERESTS } from './interests.data'
import { SplashScreen } from '@/components/splashscreen'

const INITIAL_DATA: OnboardingData = {
  interests: [],
  aboutYou: {
    pets: [],
    name:'',
    age: 18,
  },
  matchPreferences: {
    dealbreakers: {
      one: '',
      two: '',
      three: '',
      additional: '',
    },
    idealMatch: {
      personality: '',
      interests: '',
      values: '',
      qualities: [],
      notes: '',
    },
  },
  dealbreakersLifestyle: {
    smoking: '',
    drinking: '',
    children: '',
    pets: '',
    distance: '',
    additional: '',
  },
  matchPreferencesV2: {
    ageRange: '',
    distance: '',
    interestedIn: '',
    relationshipTypes: [],
    education: '',
    lifestyle: '',
    interests: [],
    religion: '',
    smoking: '',
    drinking: '',
    children: '',
    notes: '',
  },
  photos: [],
}

export function OnboardingStepController() {
  // const navigate = useNavigate()
  // const { refreshProfile } = useAuth()
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<OnboardingStep>(
    OnboardingStep.Interests
  )
  const [data, setData] = useState<OnboardingData>(INITIAL_DATA)

  // ✅ NYA STATES
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  
  const handleRemoveFile = (index: number) => {
    setData(d => ({
      ...d,
      photos: d.photos.filter((_, i) => i !== index)
    }));
  };



  const goNext = () => {
    setStep((current) =>
      Math.min(current + 1, OnboardingStep.Photos) as OnboardingStep
    )
  }

  const goBack = () => {
    setStep((current) =>
      Math.max(current - 1, OnboardingStep.Interests) as OnboardingStep
    )
  }

  

  
const finish = async () => {
  setIsSaving(true)
  setSaveError(null)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    setSaveError('User not authenticated')
    setIsSaving(false)
    return
  }

    try {
    // 1. Ladda upp ALLA bilder och samla deras URL:er
    const uploadPromises = data.photos.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('onboarding_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('onboarding_photos')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    const photoUrls = await Promise.all(uploadPromises);



    // 2. UPDATE PROFILE TABLE
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        interests: data.interests,
        about_you: data.aboutYou,
        dealbreakers_lifestyle: data.dealbreakersLifestyle,
        match_preferences_v2: data.matchPreferencesV2,
        photo_urls: photoUrls, // Make sure this column exists in SQL!
        onboarding_complete: true,
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    
    
    await refreshProfile()
    navigate('/app')

  } catch (error: any) {
    console.error('SAVE ERROR', error)
    setSaveError(error.message || 'Something went wrong while saving.')
  } finally {
    setIsSaving(false)
  }
}





  let currentStep: React.ReactNode = null

  if (step === OnboardingStep.Interests) {
    currentStep = (
      <InterestsStep
        interests={INTERESTS}
        selectedIds={data.interests}
        onToggle={(id) =>
          setData((d) => ({
            ...d,
            interests: d.interests.includes(id)
              ? d.interests.filter((x) => x !== id)
              : [...d.interests, id],
          }))
        }
        onContinue={goNext}
      />
    )
  }

  if (step === OnboardingStep.AboutYou) {
    currentStep = (
      <AboutYouStep
        values={data.aboutYou}
        onChange={(patch) =>
          setData((d) => ({
            ...d,
            aboutYou: { ...d.aboutYou, ...patch },
          }))
        }
        onContinue={goNext}
        onBack={goBack}
      />
    )
  }

  if (step === OnboardingStep.MatchPreferencesV2) {
    currentStep = (
      <MatchPreferencesV2Step
        values={data.matchPreferencesV2}
        onChange={(patch) =>
          setData((d) => ({
            ...d,
            matchPreferencesV2: {
              ...d.matchPreferencesV2,
              ...patch,
            },
          }))
        }
        onContinue={goNext}
        onBack={goBack}
      />
    )
  }

  if (step === OnboardingStep.DealbreakersLifestyle) {
    currentStep = (
      <DealbreakersLifestyleStep
        values={data.dealbreakersLifestyle}
        onChange={(patch) =>
          setData((d) => ({
            ...d,
            dealbreakersLifestyle: {
              ...d.dealbreakersLifestyle,
              ...patch,
            },
          }))
        }
        onContinue={goNext}
        onBack={goBack}
      />
    )
  }

  if (step === OnboardingStep.Photos) {
    currentStep = (
      <PhotoUploadStep
        files={data.photos}
        onFilesSelected={(files) =>
          setData((d) => ({ ...d, photos: files }))
        }
        onSave={finish}
        onBack={goBack}
        onRemoveFile={handleRemoveFile}
      />
    )
  }

  return (
    <>
      <OnboardingProgress currentStep={step} totalSteps={5} />

      <div key={step} className="animate-fade relative">
        {currentStep}

        {/* ✅ ERROR UI */}
        {saveError && (
          <p className="mt-4 text-sm text-red-500 text-center">
            {saveError}
          </p>
        )}

        {/* ✅ LOADING OVERLAY */}
        {isSaving && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <SplashScreen />
          </div>
        )}
      </div>
    </>
  )
}
