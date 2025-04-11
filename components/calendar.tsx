"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarProps {
  onSelectDate: (date: Date) => void
  availableDays: string[]
}

export default function Calendar({ onSelectDate, availableDays }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Convert availableDays strings to day numbers (0 = Sunday, 1 = Monday, etc.)
  const availableDayNumbers = availableDays.map((day) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days.indexOf(day)
  })

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const daysInMonth = getDaysInMonth(year, month)
    const firstDayOfMonth = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, isCurrentMonth: false })
    }

    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const dayOfWeek = date.getDay()

      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: isToday(date),
        isAvailable: availableDayNumbers.includes(dayOfWeek),
        date: new Date(year, month, i),
      })
    }

    return days
  }

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  // Go to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Go to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Handle date selection
  const handleDateSelect = (day: any) => {
    if (day.isAvailable && day.isCurrentMonth && day.day !== null) {
      setSelectedDate(day.date)
      onSelectDate(day.date)
    }
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h3 className="font-bold">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`
                h-10 flex items-center justify-center text-sm rounded-full
                ${!day.isCurrentMonth ? "invisible" : ""}
                ${day.isToday ? "border border-purple-700" : ""}
                ${day.isAvailable && day.isCurrentMonth ? "cursor-pointer hover:bg-purple-100" : "text-gray-400"}
                ${selectedDate && day.date && selectedDate.getTime() === day.date.getTime() ? "bg-purple-700 text-white" : ""}
              `}
              onClick={() => handleDateSelect(day)}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

