// lib/projects.ts
import type { Project, ProjectInput } from "./types"

// Get all projects
export async function getProjects(): Promise<Project[]> {
  try {
    // Use absolute URL to avoid parsing issues
    const response = await fetch('/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }
    return response.json()
  } catch (error) {
    console.error("Error getting projects:", error)
    throw new Error("Failed to get projects")
  }
}

// Get a single project by ID
export async function getProject(id: string): Promise<Project | null> {
  try {
    // Use absolute URL to avoid parsing issues
    const response = await fetch(`/api/projects/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error('Failed to fetch project')
    }
    return response.json()
  } catch (error) {
    console.error(`Error getting project ${id}:`, error)
    throw new Error("Failed to get project")
  }
}

// Save a project (create or update)
export async function saveProject(input: ProjectInput): Promise<Project> {
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })
    
    if (!response.ok) {
      throw new Error('Failed to save project')
    }
    
    return response.json()
  } catch (error) {
    console.error("Error saving project:", error)
    throw new Error("Failed to save project")
  }
}

// Delete a project
export async function deleteProject(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/projects?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete project')
    }
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw new Error("Failed to delete project")
  }
}