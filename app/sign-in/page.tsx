"use client"
import { useState } from "react"
import type React from "react"

import { useRouter } from "next/navigation"
import { getAuth, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { log } from "console"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const auth = getAuth()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Reload to ensure emailVerified is up-to-date
      await user.reload()

      if (user.emailVerified) {
        setMessage("Login successful. Redirecting...")
        // Redirect to dashboard or home page
        router.push("/dashboard")
      } else {
        setError("Email not verified. Please check your inbox or click 'Resend Verification Email' below.")
      }
    } catch (err: any) {
      setError(err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    setMessage(null)
    setLoading(true)

    const auth = getAuth()

    try {
      // First check if there's a current user
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
        setMessage("Verification email resent. Please check your inbox.")
      }
      // If no current user but we have email and password, sign in first
      else if (email && password) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password)
          await sendEmailVerification(userCredential.user)
          setMessage("Verification email sent. Please check your inbox.")
        } catch (err: any) {
          // If sign in fails, show error
          setError(err.message || "Failed to sign in to resend verification email")
        }
      } else {
        setError("Please enter your email and password to resend verification email.")
      }
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      {message && <p className="mt-4 text-green-600 text-center">{message}</p>}

      <div className="mt-4 text-center">
        <button onClick={handleResend} className="text-sm text-blue-500 underline" disabled={loading}>
          {loading ? "Sending..." : "Resend Verification Email"}
        </button>
      </div>

      <p className="mt-6 text-sm text-center">
        Don’t have an account?{" "}
        <a href="/sign-up" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  )
}
