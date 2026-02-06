import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AuthPage from "./pages/AuthPage"
import AppPage from "./pages/AppPage"
import OnboardingPage from "./pages/OnboardingPage" // Importera din nya sida
import AppLayout from "./components/AppLayout"
import { SplashScreen } from "./components/splashscreen"
import { ChatPage } from './pages/ChatPage';
import { PricingPage } from "./pages/PricingPage"



function Guard({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return (<SplashScreen /> )}
  if (!user) return <Navigate to="/" replace />
  if (profile && !profile.onboarding_complete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />
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
          <Route path="/pricing" element={<PricingPage />} />
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
    {/* Du kan lägga till fler sidor här, t.ex. /settings */}
  </Route>
</Routes>

      </BrowserRouter>
    </AuthProvider>
  )
}


    