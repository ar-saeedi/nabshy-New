import { SessionProvider } from 'next-auth/react'

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
