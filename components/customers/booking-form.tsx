'use client';
import { useState } from "react"

interface BookingFormData {
  name: string
  email: string
  phone: string
  babyAge: string // age in months or as appropriate
  bookingDate: string
  participants: number
}

interface BookingFormProps {
  onSubmit: (data: BookingFormData) => void
}

export function BookingForm({ onSubmit }: BookingFormProps) {
  const [formData, setFormData] = useState<BookingFormData>({
    name: "",
    email: "",
    phone: "",
    babyAge: "",
    bookingDate: "",
    participants: 1,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleParticipantsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const participants = parseInt(e.target.value, 10) || 1
    setFormData((prev) => ({ ...prev, participants }))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your name"
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter your phone number"
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      {/* Baby Age Field */}
      <div>
        <label htmlFor="babyAge" className="block text-sm font-medium text-gray-700">
          Baby Age (in months)
        </label>
        <input
          type="number"
          id="babyAge"
          name="babyAge"
          value={formData.babyAge}
          onChange={handleChange}
          placeholder="Enter baby age in months"
          className="mt-1 block w-full p-2 border rounded-md"
        />
      </div>

      {/* Booking Date Field */}
      <div>
        <label htmlFor="bookingDate" className="block text-sm font-medium text-gray-700">
          Booking Date
        </label>
        <input
          type="date"
          id="bookingDate"
          name="bookingDate"
          value={formData.bookingDate}
          onChange={handleChange}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>

      {/* Participants Field */}
      <div>
        <label htmlFor="participants" className="block text-sm font-medium text-gray-700">
          Number of Participants
        </label>
        <input
          type="number"
          id="participants"
          name="participants"
          value={formData.participants}
          onChange={handleParticipantsChange}
          min={1}
          className="mt-1 block w-full p-2 border rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Submit Booking
      </button>
    </form>
  )
}

export default BookingForm
