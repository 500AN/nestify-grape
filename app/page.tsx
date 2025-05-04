import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProjectList } from "@/components/project-list"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight">GrapeJS App Builder</h1>
        <p className="text-lg text-muted-foreground max-w-[600px]">
          Create, save, and edit web pages with a powerful drag-and-drop interface.
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/editor/new">Create New Project</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Your Projects</h2>
        <ProjectList />
      </div>
    </div>
  )
}
