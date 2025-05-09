import React from 'react'

function YoutubeSkeleton() {
  return (
    <div className="aspect-w-16 aspect-h-9 bg-gray-200 animate-pulse rounded-lg">
    <div className="flex items-center justify-center h-full">
      <div className="text-gray-400">
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  </div>
  )
}

export default YoutubeSkeleton