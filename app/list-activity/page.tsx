"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ListActivity() {
  const [step, setStep] = useState(1)

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link href="/" className="flex items-center text-purple-700 hover:text-purple-800 mb-8">
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-purple-700 mb-8 text-center">List Your Activity on Happity</h1>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  step >= i ? "bg-purple-700 text-white" : "bg-gray-200 text-gray-600"
                }`}
              >
                {i}
              </div>
              <span className={`text-sm ${step >= i ? "text-purple-700 font-medium" : "text-gray-500"}`}>
                {i === 1 ? "Basic Info" : i === 2 ? "Details" : "Review"}
              </span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
          <div
            className="absolute top-0 left-0 h-1 bg-purple-700 transition-all duration-300"
            style={{ width: `${(step - 1) * 50}%` }}
          ></div>
        </div>
      </div>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-6">Basic Information</h2>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Activity Name</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., Baby Yoga Classes"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Select a category</option>
              <option value="baby-yoga">Baby Yoga</option>
              <option value="dance">Dance</option>
              <option value="sports">Sports</option>
              <option value="postnatal-fitness">Postnatal Fitness</option>
              <option value="baby-first-aid">Baby First Aid</option>
              <option value="send">SEND</option>
              <option value="walk-talk">Walk & Talk</option>
              <option value="storytime">Storytime</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Age Range</label>
            <select className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option value="">Select age range</option>
              <option value="0-6">0-6 months</option>
              <option value="6-12">6-12 months</option>
              <option value="1-2">1-2 years</option>
              <option value="2-3">2-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="all">All ages</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
              placeholder="Address"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="City"
              />
              <input
                type="text"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Postcode"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={nextStep}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-6">Activity Details</h2>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
              placeholder="Describe your activity..."
            ></textarea>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Price</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="e.g., £10 per session"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Days & Times</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Days</label>
                <div className="space-y-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Times</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                    placeholder="e.g., 10:00"
                  />
                  <button className="text-purple-700 hover:text-purple-800 text-sm">+ Add another time</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Upload Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <p className="text-gray-500 mb-2">Drag and drop images here, or click to browse</p>
              <button className="text-purple-700 hover:text-purple-800 font-medium">Browse Files</button>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded"
            >
              Back
            </button>
            <button
              onClick={nextStep}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-8 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-purple-700 mb-6">Review & Submit</h2>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <h3 className="font-bold text-lg mb-2">Baby Yoga Classes</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Category:</p>
                <p className="font-medium">Baby Yoga</p>
              </div>
              <div>
                <p className="text-gray-600">Age Range:</p>
                <p className="font-medium">0-12 months</p>
              </div>
              <div>
                <p className="text-gray-600">Location:</p>
                <p className="font-medium">Wellness Center, London, E1 6AN</p>
              </div>
              <div>
                <p className="text-gray-600">Price:</p>
                <p className="font-medium">£15 per session</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Days & Times:</p>
                <p className="font-medium">Monday, Friday: 11:00, 13:30</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Description:</p>
                <p className="font-medium">
                  Gentle yoga sessions designed for new mums and their babies, helping with postnatal recovery and
                  bonding.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">
                I confirm that all the information provided is accurate and up-to-date.
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-700">
                I agree to Happity's{" "}
                <Link href="#" className="text-purple-700 hover:underline">
                  Terms and Conditions
                </Link>
                .
              </span>
            </label>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-8 rounded"
            >
              Back
            </button>
            <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded">
              SUBMIT ACTIVITY
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

