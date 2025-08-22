"use server"

type ContestEntryData = {
  name: string
  email: string
  phone: string
}

type TravelPreferencesData = {
  email: string
  travelInterests: string[]
  travelTimeframe: string
  travelers: string
}

/**
 * Submits the initial contest entry data to the first webhook.
 */
export async function submitContestEntry(data: ContestEntryData) {
  // 1. Log that the function has started
  console.log("submitContestEntry function started with data:", data)

  const { name, email, phone } = data
  const WEBHOOK_URL = "https://phoenixvoyages.ca/wp-json/gh/v4/webhooks/48-webhook-listener?token=eGlUUXU"

  const nameParts = name.trim().split(" ")
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(" ")

  const payload = {
    email,
    first_name: firstName,
    last_name: lastName,
    phone,
    source: "Contest Entry - Step 1",
    tags: ["Contest Entry"],
  }

  // 2. Implement a manual timeout controller
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000) // 8-second timeout

  try {
    console.log("Attempting to send fetch request to webhook 1...")
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal, // Pass the abort signal to fetch
    })
    clearTimeout(timeoutId) // Clear the timeout if the request succeeds

    if (response.ok) {
      console.log("Webhook 1 Success: Successfully sent data.")
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error("Webhook 1 Error:", response.status, errorText)
      return { success: false, message: `Failed to submit entry. Server responded with: ${response.status}` }
    }
  } catch (error: any) {
    clearTimeout(timeoutId) // Clear the timeout if the request fails
    if (error.name === "AbortError") {
      console.error("Webhook 1 Fetch Error: Request timed out after 8 seconds.")
      return { success: false, message: "The request timed out. The server may be unresponsive." }
    }
    console.error("Webhook 1 Fetch Error:", error)
    return { success: false, message: `An unexpected network error occurred: ${error.message}` }
  }
}

/**
 * Submits the optional travel preferences to the second webhook.
 */
export async function submitTravelPreferences(data: TravelPreferencesData) {
  console.log("submitTravelPreferences function started with data:", data)
  const { email, travelInterests, travelTimeframe, travelers } = data
  const WEBHOOK_URL = "https://phoenixvoyages.ca/wp-json/gh/v4/webhooks/49-golf-contest-extra-fieds?token=llgkHCQ"

  const payload = {
    email,
    travel_interests: travelInterests.join(", "),
    travel_timeframe: travelTimeframe,
    number_of_travelers: travelers,
    source: "Contest Entry - Step 2",
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 8000)

  try {
    console.log("Attempting to send fetch request to webhook 2...")
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)

    if (response.ok) {
      console.log("Webhook 2 Success: Successfully sent data.")
      return { success: true }
    } else {
      const errorText = await response.text()
      console.error("Webhook 2 Error:", response.status, errorText)
      return { success: false, message: `Failed to submit preferences. Server responded with: ${response.status}` }
    }
  } catch (error: any) {
    clearTimeout(timeoutId)
    if (error.name === "AbortError") {
      console.error("Webhook 2 Fetch Error: Request timed out after 8 seconds.")
      return { success: false, message: "The request timed out. The server may be unresponsive." }
    }
    console.error("Webhook 2 Fetch Error:", error)
    return { success: false, message: `An unexpected network error occurred: ${error.message}` }
  }
}
