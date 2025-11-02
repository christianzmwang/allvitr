'use server'

import { redirect } from 'next/navigation'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL

export async function sendContactToSlack(formData: FormData) {
  const entries = Object.fromEntries(formData.entries())

  const content = `New contact from ${entries.name || 'Unknown'}\nEmail: ${entries.email}\nPhone: ${entries.phone || 'N/A'}\nCompany: ${entries.company || 'N/A'}\nTitle: ${entries.title || 'N/A'}\nCountry: ${entries.country || 'N/A'}\nMessage: ${entries.message || 'N/A'}\nOrigin: ${entries.origin || 'N/A'}`

  if (SLACK_WEBHOOK_URL) {
    await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: content }),
    })
  } else {
    console.warn('Missing SLACK_WEBHOOK_URL env variable. Logging message instead.', content)
  }

  redirect('/contact?sent=1')
}
