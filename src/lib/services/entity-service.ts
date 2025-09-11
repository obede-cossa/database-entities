import api from "./axios"
import type { Entity } from "@/types/entities"

const endpoint = "/entities"

export const entityService = {
  getAll: async (): Promise<Entity[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<Entity> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (entity: Omit<Entity, "id">): Promise<Entity> => {
    const { data } = await api.post(endpoint, entity)
    return data
  },

  update: async (id: number, entity: Partial<Entity>): Promise<Entity> => {
    const { data } = await api.put(`${endpoint}/${id}`, entity)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
