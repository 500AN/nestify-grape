// components/editor.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveProject } from "@/lib/projects"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import Link from "next/link"
import dynamic from "next/dynamic"

// Import styles
import '@grapesjs/studio-sdk/style'

// Dynamically import the StudioEditor component to avoid SSR issues
const StudioEditor = dynamic(
  () => import('@grapesjs/studio-sdk/react').then((mod) => mod.default),
  { ssr: false }
)

interface EditorProps {
  projectId: string
  initialData: string | null
}

export function Editor({ projectId, initialData }: EditorProps) {
  const router = useRouter()
  const [editor, setEditor] = useState<any>(null)
  const [projectName, setProjectName] = useState<string>("")
  const [isSaving, setIsSaving] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadingError, setLoadingError] = useState<string | null>(null)

  // Set default project name for new projects
  useEffect(() => {
    if (projectId === "new" && !projectName) {
      setProjectName(`Project ${new Date().toLocaleString()}`)
    }
  }, [projectId, projectName])

  // Parse initial data if available
  const getInitialPages = () => {
    if (initialData) {
      try {
        const parsedData = JSON.parse(initialData)
        return [
          { 
            name: 'Home', 
            component: parsedData.html || '<h1>Home page</h1>',
            styles: parsedData.css || ''
          }
        ]
      } catch (e) {
        console.error("Error parsing initial data:", e)
        return [
          { name: 'Home', component: '<h1>Home page</h1>' }
        ]
      }
    }
    return [
      { name: 'Home', component: '<h1>Home page</h1>' },
      { name: 'About', component: '<h1>About page</h1>' },
      { name: 'Contact', component: '<h1>Contact page</h1>' }
    ]
  }

  // Handle editor ready event
  const handleEditorReady = (editorInstance: any) => {
    setEditor(editorInstance)
    setIsLoaded(true)
    console.log("GrapesJS Studio SDK loaded successfully")
  }

  // Handle editor error
  const handleEditorError = (error: any) => {
    console.error("Failed to initialize GrapesJS Studio SDK:", error)
    setLoadingError("Failed to initialize editor. Please check console for details.")
  }

  // Handle save
  const handleSave = async () => {
    if (!editor || !projectName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a project name",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      
      // Get HTML and CSS from editor
      const html = editor.getHtml()
      const css = editor.getCss()
      
      // Create HTML version (ready for download)
      const htmlVersion = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
</body>
</html>`

      // Create editor version (for GrapesJS editing)
      const editorVersion = JSON.stringify({
        html,
        css,
        components: editor.getComponents(),
        styles: editor.getStyle(),
        timestamp: new Date().toISOString()
      })
      
      // Save project with both versions
      const savedProject = await saveProject({
        id: projectId === "new" ? undefined : projectId,
        name: projectName,
        htmlVersion,
        editorVersion,
      })
      
      toast({
        title: "Success",
        description: "Project saved successfully",
      })
      
      // Redirect to the saved project if it's a new one
      if (projectId === "new") {
        router.push(`/editor/${savedProject.id}`)
      }
      
    } catch (error) {
      console.error("Failed to save project:", error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle download
  const handleDownload = async () => {
    if (!editor || !projectName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a project name",
        variant: "destructive",
      })
      return
    }
  
    try {
      setIsDownloading(true)
      
      // Get HTML and CSS from editor
      const html = editor.getHtml()
      const css = editor.getCss()
      
      // Create a complete HTML document
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <style>
${css}
    </style>
</head>
<body>
${html}
</body>
</html>`
      
      // Create filename
      const filename = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`
      
      // Send to server API endpoint
      const response = await fetch('/api/save-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: fullHtml,
          filename
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save file to server');
      }
      
      const result = await response.json()
      
      toast({
        title: "Success",
        description: `HTML file saved to server at ${result.path}`,
      })
      
      // Also download to user's browser
      const blob = new Blob([fullHtml], { type: 'text/html' })
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
      
    } catch (error) {
      console.error("Failed to save project:", error)
      toast({
        title: "Error",
        description: `Failed to save: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleDownload} 
              disabled={isDownloading || !isLoaded}
              variant="outline"
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download HTML"}
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !isLoaded}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : !isLoaded ? "Editor Loading..." : "Save Project"}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        {/* Studio SDK editor component */}
        <StudioEditor
          options={{
            height: '100%',
            width: '100%',
            project: {
              type: 'web',
              default: {
                pages: getInitialPages()
              }
            },
            // Disable storage manager as we'll handle saving ourselves
            storageManager: false,
            // Additional configuration options
            panels: {
              defaults: [
                // You can customize panels here
              ]
            },
            blockManager: {
              blocks: [
                // You can define custom blocks here
              ]
            }
          }}
          onReady={handleEditorReady}
          onError={handleEditorError}
        />
        
        {(!isLoaded || loadingError) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-50">
            <div className="flex flex-col items-center gap-2">
              {loadingError ? (
                <div className="text-red-500 text-center p-4 max-w-md">
                  <h3 className="font-bold mb-2">Error Loading Editor</h3>
                  <p>{loadingError}</p>
                  <p className="mt-2 text-sm">Try refreshing the page or check console for details.</p>
                </div>
              ) : (
                <>
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p>Loading editor...</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Toaster />
    </div>
  )
}