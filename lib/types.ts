// lib/types.ts
export interface Project {
  id: string
  name: string
  htmlVersion: string
  editorVersion: string
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  id?: string
  name: string
  htmlVersion: string
  editorVersion: string
}