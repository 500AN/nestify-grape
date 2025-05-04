"use client"

import { SignIn } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const router = useRouter();
  
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-md rounded-lg border border-border',
          }
        }}
        redirectUrl="/home"
        afterSignInUrl="/home"
      />
    </div>
  )
}