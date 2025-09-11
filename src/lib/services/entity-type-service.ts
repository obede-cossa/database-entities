import api from "./axios"
import type { EntityType } from "@/types/entities"

const endpoint = "/entity-types"

export const entityTypeService = {
  getAll: async (): Promise<EntityType[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<EntityType> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (type: Omit<EntityType, "id">): Promise<EntityType> => {
    const { data } = await api.post(endpoint, type)
    return data
  },

  update: async (id: number, type: Partial<EntityType>): Promise<EntityType> => {
    const { data } = await api.put(`${endpoint}/${id}`, type)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
