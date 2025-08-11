import { redirect } from 'next/navigation'

export async function sendContactToSlack(formData: FormData) {
  'use server'

  const name = (formData.get('name') || '').toString().trim()
  const email = (formData.get('email') || '').toString().trim()
  const phone = (formData.get('phone') || '').toString().trim()
  const company = (formData.get('company') || '').toString().trim()
  const title = (formData.get('title') || '').toString().trim()
  const country = (formData.get('country') || '').toString().trim()
  const message = (formData.get('message') || '').toString().trim()

  const originRaw = (formData.get('origin') || '/').toString()
  const origin = originRaw.startsWith('/') ? originRaw : '/'

  const text = [
    '*New Website Contact*',
    `Name: ${name || 'N/A'}`,
    `Email: ${email || 'N/A'}`,
    `Phone: ${phone || 'N/A'}`,
    `Company: ${company || 'N/A'}`,
    `Title: ${title || 'N/A'}`,
    `Country: ${country || 'N/A'}`,
    `Message: ${message || 'N/A'}`,
  ].join('\n')

  try {
    const botToken =
      process.env.SLACK_BOT_TOKEN ?? process.env['slack_bot_token']
    const channelId =
      process.env.SLACK_CHANNEL_ID ??
      process.env['slack_channel_ID'] ??
      process.env['slack_channel_id']

    if (botToken && channelId) {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${botToken}`,
        },
        body: JSON.stringify({
          channel: channelId,
          text,
          blocks: [
            {
              type: 'section',
              text: { type: 'mrkdwn', text: '*New Website Contact*' },
            },
            {
              type: 'section',
              fields: [
                { type: 'mrkdwn', text: `*Name*\n${name || 'N/A'}` },
                { type: 'mrkdwn', text: `*Email*\n${email || 'N/A'}` },
                { type: 'mrkdwn', text: `*Phone*\n${phone || 'N/A'}` },
                { type: 'mrkdwn', text: `*Company*\n${company || 'N/A'}` },
                { type: 'mrkdwn', text: `*Title*\n${title || 'N/A'}` },
                { type: 'mrkdwn', text: `*Country*\n${country || 'N/A'}` },
              ],
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: `*Message*\n${message || 'N/A'}` },
            },
          ],
        }),
        cache: 'no-store',
      })

      const result = await response.json()
      if (!result.ok) {
        console.error('Slack API error', result)
        redirect(`${origin}?sent=0`)
      }
    } else {
      const webhookUrl = process.env.SLACK_WEBHOOK_URL
      if (!webhookUrl) {
        console.error(
          'No Slack configuration provided (missing bot token + channel or webhook URL).',
        )
        redirect(`${origin}?sent=0`)
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        cache: 'no-store',
      })

      if (!response.ok) {
        console.error('Failed to post to Slack', await response.text())
        redirect(`${origin}?sent=0`)
      }
    }
  } catch (error) {
    console.error('Error posting to Slack', error)
    redirect(`${origin}?sent=0`)
  }

  redirect(`${origin}?sent=1`)
}
