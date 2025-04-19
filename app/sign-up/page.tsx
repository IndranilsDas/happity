"use client";
import type React from "react"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

export default function AuthSignup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"customer" | "provider">("customer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        fullName,
        email,
        role,
        emailVerified: false,
        createdAt: new Date(),
      })

      // Send email verification
      await sendEmailVerification(user)

      setVerificationSent(true)
      setMessage("Account created! Please check your email to verify your account.")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setError("")
    setMessage("")
    setResendLoading(true)

    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser)
        setMessage("Verification email resent. Please check your inbox.")
      } else {
        setError("You need to be signed in to resend verification email.")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setResendLoading(false)
    }
  }

  const handleGoToLogin = () => {
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h2>

      {verificationSent ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Verify your email</h3>
            <p className="text-blue-700 mb-3">
              We've sent a verification link to <span className="font-medium">{email}</span>
            </p>
            <p className="text-sm text-blue-600">
              Please check your inbox and click the verification link to activate your account.
            </p>
          </div>

          <button
            onClick={handleResendVerification}
            disabled={resendLoading}
            className="w-full py-2 px-4 rounded-lg bg-white border border-blue-500 text-blue-600 font-medium hover:bg-blue-50 transition-colors duration-200"
          >
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </button>

          <button
            onClick={handleGoToLogin}
            className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Go to Login
          </button>

          {message && <p className="text-green-600 text-center text-sm">{message}</p>}
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </div>
      ) : (
        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="role-select" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as "customer" | "provider")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="customer">Customer</option>
              <option value="provider">Provider</option>
            </select>
          </div>

          <div>
            <label htmlFor="name-input" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name-input"
              type="text"
              value={fullName}
              required
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password-input"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-colors duration-200 ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Log in
            </a>
          </p>
        </form>
      )}
    </div>
  )
}
