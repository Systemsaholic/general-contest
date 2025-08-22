"use client"

import type React from "react"
import { useState, useEffect, useRef, type FormEvent } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitContestEntry, submitTravelPreferences } from "@/lib/actions"
import { PhoenixLogo } from "@/components/icons/logo"

type FormData = {
  name: string
  email: string
  phone: string
  travelInterests: string[]
  travelTimeframe: string
  travelers: string
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  travelInterests: [],
  travelTimeframe: "",
  travelers: "1",
}

export function MultiStepForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [view, setView] = useState<"entry" | "preferences" | "success">("entry")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const resetForm = () => {
    setFormData(initialFormData)
    setView("entry")
    setError(null)
    setErrors({})
  }

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (view === "preferences" || view === "success") {
      timerRef.current = setTimeout(() => {
        resetForm()
      }, 10000)
    }
  }

  useEffect(() => {
    const handleActivity = () => {
      resetTimer()
    }

    if (view === "preferences" || view === "success") {
      resetTimer()
      
      window.addEventListener("mousemove", handleActivity)
      window.addEventListener("click", handleActivity)
      window.addEventListener("keydown", handleActivity)
      window.addEventListener("touchstart", handleActivity)
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      window.removeEventListener("mousemove", handleActivity)
      window.removeEventListener("click", handleActivity)
      window.removeEventListener("keydown", handleActivity)
      window.removeEventListener("touchstart", handleActivity)
    }
  }, [view])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (interest: string) => {
    setFormData((prev) => {
      const newInterests = prev.travelInterests.includes(interest)
        ? prev.travelInterests.filter((i) => i !== interest)
        : [...prev.travelInterests, interest]
      return { ...prev, travelInterests: newInterests }
    })
  }

  const validateEntryForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Name is required."
    if (!formData.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid."
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required."
    } else if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Please enter a valid phone number."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContestSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateEntryForm()) return

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitContestEntry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      })
      if (result.success) {
        setView("preferences")
      } else {
        setError(result.message || "An error occurred.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePreferencesSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const result = await submitTravelPreferences({
        email: formData.email, // Include email from the first step
        travelInterests: formData.travelInterests,
        travelTimeframe: formData.travelTimeframe,
        travelers: formData.travelers,
      })
      if (result.success) {
        setView("success")
      } else {
        setError(result.message || "An error occurred.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderEntryForm = () => (
    <form onSubmit={handleContestSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Win a $250 Vacation Voucher!</h1>
        <p className="text-sm sm:text-base text-gray-300">Enter your information to win</p>
      </div>
      <div>
        <Label htmlFor="name" className="text-gray-300">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="e.g. Jane Doe"
          className="bg-white/10 text-white border-gray-500 placeholder:text-gray-400"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>
      <div>
        <Label htmlFor="email" className="text-gray-300">
          Email Address
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="e.g. jane.doe@example.com"
          className="bg-white/10 text-white border-gray-500 placeholder:text-gray-400"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>
      <div>
        <Label htmlFor="phone" className="text-gray-300">
          Phone Number
        </Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="e.g. (555) 123-4567"
          className="bg-white/10 text-white border-gray-500 placeholder:text-gray-400"
        />
        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-500 hover:bg-amber-600 text-black text-base sm:text-lg py-4 sm:py-6"
      >
        {isSubmitting ? <Loader2 className="h-6 w-6 animate-spin" /> : "ENTER CONTEST"}
      </Button>
    </form>
  )

  const renderPreferencesForm = () => (
    <form onSubmit={handlePreferencesSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">You're Entered!</h2>
        <p className="text-sm sm:text-base text-gray-300">Tell us about your travel dreams to get personalized offers (optional).</p>
      </div>
      <div>
        <Label className="text-gray-300 block mb-2">What type of travel are you interested in?</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {["All-Inclusive", "Cruise", "Guided Tour", "Custom Itinerary"].map((item) => (
            <div key={item} className="flex items-center space-x-2">
              <Checkbox
                id={item}
                checked={formData.travelInterests.includes(item)}
                onCheckedChange={() => handleCheckboxChange(item)}
                className="border-gray-400 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label htmlFor={item} className="text-gray-300">
                {item}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label htmlFor="travelTimeframe" className="text-gray-300">
          When are you looking to travel?
        </Label>
        <Select
          name="travelTimeframe"
          onValueChange={(value) => handleSelectChange("travelTimeframe", value)}
          value={formData.travelTimeframe || undefined}
        >
          <SelectTrigger className="w-full bg-white/10 text-white border-gray-500">
            <SelectValue placeholder="Select a timeframe" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 text-white border-gray-600">
            <SelectItem value="3m">Within 3 months</SelectItem>
            <SelectItem value="6m">3-6 months</SelectItem>
            <SelectItem value="12m">6-12 months</SelectItem>
            <SelectItem value="12p">12+ months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="travelers" className="text-gray-300">
          How many people will be travelling?
        </Label>
        <Input
          id="travelers"
          name="travelers"
          type="number"
          min="1"
          value={formData.travelers}
          onChange={handleInputChange}
          className="bg-white/10 text-white border-gray-500"
        />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-amber-600 text-black">
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Preferences"}
      </Button>
      <button
        type="button"
        onClick={resetForm}
        className="w-full text-center text-gray-400 hover:text-gray-300 transition-colors text-sm mt-4"
      >
        Start a new entry
      </button>
    </form>
  )

  const renderSuccessMessage = () => (
    <div className="text-center">
      <div className="mx-auto bg-green-500 rounded-full h-16 w-16 flex items-center justify-center mb-4">
        <Check className="h-10 w-10 text-white" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">All Set!</h1>
      <p className="text-sm sm:text-base text-gray-300">Thank you for sharing. We'll be in touch if you're the lucky winner!</p>
      <button
        onClick={resetForm}
        className="text-gray-400 hover:text-gray-300 transition-colors text-sm mt-6 inline-block"
      >
        Start a new entry
      </button>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-black/60 backdrop-blur-md rounded-2xl shadow-2xl p-4 sm:p-8 border border-white/20">
        <div className="flex justify-center items-center gap-4 mb-6">
          <PhoenixLogo className="h-16 w-auto" />
          <div className="flex flex-col text-white font-bold leading-tight">
            <span className="text-2xl sm:text-3xl">Phoenix</span>
            <span className="text-2xl sm:text-3xl">Voyages</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {view === "entry" && renderEntryForm()}
            {view === "preferences" && renderPreferencesForm()}
            {view === "success" && renderSuccessMessage()}
          </motion.div>
        </AnimatePresence>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">
        Contest rules and regulations apply. Voucher is non-transferable.
      </p>
    </div>
  )
}
