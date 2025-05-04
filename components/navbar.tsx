"use client"

import Link from "next/link"
import { Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Home className="h-5 w-5" />
            <span>GrapeJS App Builder</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
        <ModeToggle />
          <SignedIn>
            {/* Show these elements when user is signed in */}
            <Button asChild variant="outline" size="sm">
              <Link href="/editor/new">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Link>
            </Button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          
          <SignedOut>
            {/* Show sign in button when user is signed out */}
            <Button asChild variant="outline" size="sm">
              <SignInButton mode="modal">
                Sign In
              </SignInButton>
            </Button>
          </SignedOut>
          
        </div>
      </div>
    </header>
  )
}