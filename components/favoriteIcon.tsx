/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Yd5juJ90nfF
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import { useState } from "react"

export default function FavoriteIcon() {
  const [isFavorited, setIsFavorited] = useState(false)
  const handleFavorite = () => {
    setIsFavorited(!isFavorited)
  }
  return (
    <div className="flex items-center justify-center">
      <button variant="ghost"
      size="icon"
      onClick={handleFavorite}
      className={`
        rounded-full
        transition-transform
        duration-200
        ease-in-out
        hover:scale-125
        ${isFavorited ? "bg-red-500 text-white" : "bg-white text-red-500"}
        text-center
      `}
      >
      <HeartIcon className="h-7 w-7" />
      <span className="sr-only">{isFavorited ? "Remove from favorites" : "Add to favorites"}</span>
      </button>
      </div>
  )
}

function HeartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  )
}
