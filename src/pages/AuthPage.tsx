import { useState } from "react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Chrome } from "lucide-react"

export default function AuthPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)


   useEffect(() => {
 
  if (window.location.pathname !== "/") return

  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      navigate("/app")
    }
  })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      navigate("/app")
    }
  })

  return () => subscription.unsubscribe()
}, [navigate])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    navigate("/app")
  }

  const handleSignup = async () => {
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) return setError(error.message)
    navigate("/app")
  }

  // const handleGoogleLogin = async () => {
  //   const { error } = await supabase.auth.signInWithOAuth({
  //     provider: 'google',
  //     options: {
  //       redirectTo: `${window.location.origin}/app`
  //     }
  //   })
  //   if (error) setError(error.message)
  // }

const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) setError(error.message)
}



  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-brand-500 to-rose-400 p-3 rounded-2xl shadow-lg">
              <Heart className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Welcome back</CardTitle>
          <CardDescription>
            Enter credentials to access or create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Google Login Section */}
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-full border-gray-200 hover:bg-gray-50 gap-2"
            onClick={handleGoogleLogin}
          >
            <Chrome className="w-5 h-5 text-red-500" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              className="rounded-xl h-11"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              className="rounded-xl h-11"
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button 
            disabled={loading}
            onClick={handleLogin}
            className="w-full h-12 rounded-full bg-gradient-to-r from-brand-500 to-rose-400 hover:from-brand-600 hover:to-rose-500 text-white font-bold text-lg shadow-md"
          >
            {loading ? "Please wait..." : "Login"}
          </Button>
          <p className="text-sm text-center text-muted-foreground"></p>

          <Button 
            variant="ghost" 
            disabled={loading}
            onClick={handleSignup}
            className="w-full rounded-full hover:bg-brand-50 hover:text-brand-600"
          >
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
