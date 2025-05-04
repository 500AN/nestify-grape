// components/project-list.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Edit, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getProjects, deleteProject } from "@/lib/projects"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Project } from "@/lib/types"

export function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectList = await getProjects()
        setProjects(projectList)
      } catch (error) {
        console.error("Failed to load projects:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id)
        setProjects(projects.filter((project) => project.id !== id))
        toast({
          title: "Success",
          description: "Project deleted successfully",
        })
      } catch (error) {
        console.error("Failed to delete project:", error)
        toast({
          title: "Error",
          description: "Failed to delete project",
          variant: "destructive",
        })
      }
    }
  }

  const handleDownload = async (project: Project) => {
    try {
      setDownloadingId(project.id)
      
      // Use the HTML version directly for download
      const filename = `${project.name.replace(/\s+/g, '-').toLowerCase()}.html`
      
      // Create a blob from the HTML version
      const blob = new Blob([project.htmlVersion], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)
      
      toast({
        title: "Success",
        description: "HTML file downloaded successfully",
      })
      
    } catch (error) {
      console.error("Failed to download project:", error)
      toast({
        title: "Error",
        description: "Failed to download HTML file",
        variant: "destructive",
      })
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading projects...</div>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/50">
        <p className="text-muted-foreground mb-4">You don't have any projects yet.</p>
        <Button asChild>
          <Link href="/editor/new">Create Your First Project</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Last edited: {new Date(project.updatedAt).toLocaleString()}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/editor/${project.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDownload(project)}
                disabled={downloadingId === project.id}
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadingId === project.id ? "Downloading..." : "Download"}
              </Button>
            </div>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
      <Toaster />
    </div>
  )
}