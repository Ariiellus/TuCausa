"use client"

import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'
import Image from 'next/image'

export const EnsProfile = () => {
  const { address } = useAccount()
  const { data: name, isLoading: nameLoading, error: nameError } = useEnsName({ address, chainId: 1 })
  const { data: avatar, isLoading: avatarLoading, error: avatarError } = useEnsAvatar({ name: name || undefined, chainId: 1 })

  // Debug logging
  console.log('ENS Profile Debug:', {
    address,
    name,
    nameLoading,
    nameError,
    avatar,
    avatarLoading,
    avatarError
  })

  if (!address) return null

  return (
    <div className="flex items-center gap-2">
      {avatar ? (
        <Image 
          src={avatar} 
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover" 
          alt="ENS Avatar"
        />
      ) : (
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {avatarLoading ? '...' : '?'}
          </span>
        </div>
      )}
      <div className="flex flex-col leading-none">
        <span className="font-semibold text-sm">
          {nameLoading ? 'Loading...' : (name || `${address.slice(0, 6)}...${address.slice(-4)}`)}
        </span>
        <span className="text-muted-foreground text-xs">
          {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      </div>
    </div>
  )
}
