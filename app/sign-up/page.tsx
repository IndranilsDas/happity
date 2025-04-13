"use client"

import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function AuthSignup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"customer" | "provider">("customer")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        createdAt: new Date(),
      })

      alert(`Signed up successfully as ${role}!`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 rounded-2xl shadow-lg border border-gray-200 bg-white">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create an Account</h2>

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
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
      </form>
    </div>
  )
}
