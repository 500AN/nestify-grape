"use client"

import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-120px)]">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-md rounded-lg border border-border',
          }
        }}
        redirectUrl="/home"
        afterSignUpUrl="/home"
      />
    </div>
  )
}