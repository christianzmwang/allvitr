'use server'

import { redirect } from 'next/navigation'

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL
const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

export async function sendContactToSlack(formData: FormData) {
  // Verify Turnstile token
  const turnstileToken = formData.get('cf-turnstile-response')

  if (!turnstileToken || !TURNSTILE_SECRET_KEY) {
    console.error('Missing Turnstile token or secret key')
    redirect('/contact?error=verification')
  }

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: turnstileToken as string,
    }),
  })

  const verifyResult = await verifyResponse.json()

  if (!verifyResult.success) {
    console.error('Turnstile verification failed:', verifyResult)
    redirect('/contact?error=verification')
  }

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
