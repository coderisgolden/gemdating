import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AuthPage from "./pages/AuthPage"
import AppPage from "./pages/AppPage"
import OnboardingPage from "./pages/OnboardingPage" // Importera din nya sida
import AppLayout from "./components/AppLayout"
import { SplashScreen } from "./components/splashscreen"
import { ChatPage } from './pages/ChatPage';
import { PricingPage } from "./pages/PricingPage"
import { LikesPage } from "./pages/LikesPage"



// function Guard({ children }: { children: React.ReactNode }) {
//   const { user, profile, loading } = useAuth()
//   const location = useLocation()
//   if (loading) {
//     return (<SplashScreen /> )}
//   if (!user) return <Navigate to="/" replace />
//   if (profile && !profile.onboarding_complete && location.pathname !== "/onboarding") {
//     return <Navigate to="/onboarding" replace />
//  }
// return <>{children}</>
// }


function Guard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <SplashScreen />
  
  // 1. Not logged in? Send to Landing/Auth
  if (!user) return <Navigate to="/" replace />

  // 2. Logged in but NO profile yet (New Google User) OR Onboarding not finished?
  // We check if they are NOT already on the onboarding page to avoid infinite loops.
  const isNotOnboarded = !profile || !profile.onboarding_complete;
  
  if (isNotOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
  }

  // 3. User is logged in and fully onboarded
  return <>{children}</>
}

// function PageWrapper({ children }: { children: React.ReactNode }) {
//   return <div className="animate-fade-in">{children}</div>
// }

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
       <Routes>
        {/* Publik */}
          <Route path="/" element={<AuthPage />} />
          
        {/* 2. ONBOARDING (Guard finns, men ingen navbar layout) */}
  <Route path="/onboarding" element={
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
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/likes" element={<LikesPage />} />
    <Route path="/pricing" element={<PricingPage />} />
    {/* Du kan lägga till fler sidor här, t.ex. /settings */}
  </Route>
</Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}


    