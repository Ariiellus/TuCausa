import Image from "next/image"

interface TuCausaLogoProps {
  width?: number
  height?: number
  className?: string
  format?: "svg" | "png"
}

export function TuCausaLogo({ width = 120, height = 60, className, format = "svg" }: TuCausaLogoProps) {
  const src = format === "png" ? "/tucausa-logo.png" : "/tucausa-logo.svg"
  
  return (
    <Image
      src={src}
      alt="Tu Causa Logo"
      width={width}
      height={height}
      className={className}
      priority
    />
  )
}

// Compact version for header
export function TuCausaLogoCompact({ className }: { className?: string }) {
  return <TuCausaLogo width={80} height={40} className={className} />
}

// Large version for hero sections
export function TuCausaLogoLarge({ className }: { className?: string }) {
  return <TuCausaLogo width={200} height={100} className={className} />
}
