import api from "./axios"
import type { EntityStatus } from "@/types/entities"

const endpoint = "/entity-status"

export const entityStatusService = {
  getAll: async (): Promise<EntityStatus[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<EntityStatus> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (status: Omit<EntityStatus, "id">): Promise<EntityStatus> => {
    const { data } = await api.post(endpoint, status)
    return data
  },

  update: async (id: number, status: Partial<EntityStatus>): Promise<EntityStatus> => {
    const { data } = await api.put(`${endpoint}/${id}`, status)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
