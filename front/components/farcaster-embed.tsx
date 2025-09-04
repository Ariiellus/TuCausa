"use client"

import Head from "next/head"

interface FarcasterEmbedProps {
  title: string
  url: string
  imageUrl?: string
  splashBackgroundColor?: string
}

export function FarcasterEmbed({ 
  title, 
  url, 
  imageUrl = "https://tu-causa.vercel.app/tucausa-logo.png",
  splashBackgroundColor = "#6200ea"
}: FarcasterEmbedProps) {
  const farcasterEmbed = {
    version: "1",
    imageUrl,
    button: {
      title,
      action: {
        type: "launch_miniapp",
        url,
        name: "TuCausa",
        splashImageUrl: imageUrl,
        splashBackgroundColor
      }
    }
  }

  return (
    <Head>
      <meta name="fc:miniapp" content={JSON.stringify(farcasterEmbed)} />
      <meta name="fc:frame" content={JSON.stringify(farcasterEmbed)} />
    </Head>
  )
}
