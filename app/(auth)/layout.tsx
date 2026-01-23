// app/(auth)/layout.tsx
import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-surface/5">
      <div className="relative">
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto justify-center px-4 sm:px-6 lg:px-8 flex flex-col items-center py-20">
            <Link href="/" className="inline-block">
              <Image
                src="/logot.png"
                alt="PropertyVision Logo"
                width={100}
                height={50}
              />
            </Link>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
