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
import { supabase } from "@/lib/supabase"



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


// function Guard({ children }: { children: React.ReactNode }) {
//   const { user, profile, loading } = useAuth()
//   const location = useLocation()

//   if (loading) return <SplashScreen />
  
//   // 1. Not logged in? Send to Landing/Auth
//   if (!user) return <Navigate to="/" replace />

//   // 2. Logged in but NO profile yet (New Google User) OR Onboarding not finished?
//   // We check if they are NOT already on the onboarding page to avoid infinite loops.
//   const isNotOnboarded = !profile || !profile.onboarding_complete;
  
//   if (isNotOnboarded && location.pathname !== "/onboarding") {
//     return <Navigate to="/onboarding" replace />
//   }

 
//   return <>{children}</>
// }

// supabase.auth.onAuthStateChange((_event, _session) => {
//   if (window.location.hash.includes("access_token")) {
//     window.history.replaceState(
//       null,
//       "",
//       window.location.pathname
//     )
//   }
// })




function Guard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  // 1. Om vi fortfarande hämtar auth-status, visa splash
  if (loading) return <SplashScreen />
  
  // 2. Om ingen användare är inloggad, skicka till login
  if (!user) return <Navigate to="/" replace />

  // 3. SPECIALKOLL FÖR ONBOARDING:
  // Vi kollar om användaren faktiskt är på onboarding-sidan just nu.
  const isOnOnboardingPage = location.pathname === "/onboarding";

  // Om profilen saknas (ny Google-user) eller inte är klar:
  const isNotOnboarded = !profile || profile.onboarding_complete === false;
  
  if (isNotOnboarded && !isOnOnboardingPage) {
    // Skicka till onboarding om de inte redan är där
    return <Navigate to="/onboarding" replace />
  }

  // 4. Om de ÄR på onboarding men faktiskt är klara (t.ex. tryckt på back-knappen)
  if (profile?.onboarding_complete && isOnOnboardingPage) {
    return <Navigate to="/app" replace />
  }

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


    