import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AuthPage from "./pages/AuthPage"
import AppPage from "./pages/AppPage"
import OnboardingPage from "./pages/OnboardingPage" // Importera din nya sida
import AppLayout from "./components/AppLayout"
import { SplashScreen } from "./components/splashscreen"

function Guard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // Om loading är true (vi kollar session ELLER hämtar profil), visa Splash
  if (loading) {
    return (
      // <div className="h-screen w-screen flex items-center justify-center bg-background">
      //   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      // </div>
      <SplashScreen /> 
    )
  }

  if (!user) return <Navigate to="/" replace />

  // Nu vet vi med säkerhet om onboarding_complete är true eller false
  if (profile && !profile.onboarding_complete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       
<Routes>
  {/* Publik */}
  <Route path="/" element={<AuthPage />} />

     {/* 2. ONBOARDING (Guard finns, men ingen navbar layout) */}
  <Route 
    path="/onboarding" 
    element={
      <Guard>
        <OnboardingPage />
      </Guard>
    }  />


  {/* Skyddat område med Layout */}
  <Route 
    element={
      <Guard>
        <AppLayout />
      </Guard>
    }
  >
    <Route path="/app" element={<AppPage />} />
    <Route path="/onboarding" element={<OnboardingPage />} />
    {/* Du kan lägga till fler sidor här, t.ex. /settings */}
  </Route>
</Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}


    //  <Routes>
    //       {/* Publik rutt */}
    //       <Route path="/" element={<AuthPage />} />

    //       {/* Onboarding - Skyddad av Guard */}
    //       <Route
    //         path="/onboarding"
    //         element={
    //           <Guard>
    //             <OnboardingPage />
    //           </Guard>
    //         }
    //       />

    //       {/* Appen - Skyddad av Guard */}
    //       <Route
    //         path="/app"
    //         element={
    //           <Guard>
    //             <AppPage />
    //           </Guard>
    //         }
    //       />
    //     </Routes>