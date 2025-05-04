// app/editor/[id]/page.tsx
import { Editor } from "@/components/editor"
import { prisma } from "@/lib/db" // Import prisma directly for server components

interface EditorPageProps {
  params: {
    id: string
  }
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { id } = params
  
  // For new projects, we don't need to fetch data
  if (id === "new") {
    return <Editor projectId="new" initialData={null} />
  }
  
  // For existing projects, fetch the data directly with Prisma
  try {
    const project = await prisma.project.findUnique({
      where: { id }
    })
    
    if (!project) {
      return (
        <div className="container mx-auto py-10 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p>The project you're looking for doesn't exist or has been deleted.</p>
        </div>
      )
    }
    
    return <Editor projectId={id} initialData={project.editorVersion} />
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error)
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Project</h1>
        <p>There was an error loading this project. Please try again later.</p>
      </div>
    )
  }
}