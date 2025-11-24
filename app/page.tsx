"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
export default function Home() {
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (token) {
      router.push("/feed")
    }
  }, [router])
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">RNSTweets</h1>
          <p className="text-lg text-muted-foreground">A safe, inclusive social platform for RNSIT</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-8 space-y-6">
          <p className="text-foreground/80">
            Join our community exclusively for RNSIT students and faculty. Share, connect, and express yourself in a
            moderated, respectful environment.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/signup">
              <button className="btn-primary w-full">Create Account</button>
            </Link>
            <Link href="/login">
              <button className="btn-secondary w-full">Sign In</button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">Only @rnsit.ac.in email addresses are accepted</p>
        </div>
        <div className="grid grid-cols-3 gap-4 pt-8">
          <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="text-[clamp(1rem,2vw,1.5rem)] font-bold text-primary break-words">Safe</div>
            <p className="text-xs text-muted-foreground">AI-moderated content</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="text-[clamp(1rem,2vw,1.5rem)] font-bold text-accent break-words">Private</div>
            <p className="text-xs text-muted-foreground">RNSIT only</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="text-[clamp(1rem,2vw,1.5rem)] font-bold text-primary break-words">Community</div>
            <p className="text-xs text-muted-foreground">Together</p>
          </div>
        </div>
      </div>
    </main>
  )
}
