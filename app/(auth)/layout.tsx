// app/(auth)/layout.tsx
import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-surface/5 flex flex-col">
      {/* Header */}
      <header className="py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <Link href="/" className=" items-center gap-3 flex flex-col">
            <Image
              src="/logot.png"
              alt="PropertyVision Ltd Logo"
              width={110}
              height={55}
              priority
            />
            {/* <h2 className='class="block text-xl font-bold text-white"'>
              PropertyVision
            </h2> */}
          </Link>
        </div>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md px-4">{children}</div>
      </main>

      {/* Footer (VERY IMPORTANT for Chrome trust) */}
      <footer className="py-6 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} Property Vision Leadgate Development
              Ltd. All rights reserved.
            </p>

            <nav className="flex items-center gap-4">
              <Link
                href="/about"
                className="hover:text-gray-700 underline-offset-4 hover:underline"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-gray-700 underline-offset-4 hover:underline"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="hover:text-gray-700 underline-offset-4 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-gray-700 underline-offset-4 hover:underline"
              >
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
