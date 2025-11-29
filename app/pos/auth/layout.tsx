import { ReactNode } from "react"

/**
 * Clean Authentication Layout - No Sidebar, No Navigation
 * Enhanced styling with gradient background and larger width
 * For login, register, forgot password, verify email pages
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl">
        {children}
      </div>
    </div>
  )
}
