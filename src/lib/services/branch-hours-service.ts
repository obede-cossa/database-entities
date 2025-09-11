import api from "./axios"
import type { EntityBranchHours } from "@/types/entities"

const endpoint = "/branch-hours"

export const branchHoursService = {
  getAll: async (): Promise<EntityBranchHours[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<EntityBranchHours> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (hours: Omit<EntityBranchHours, "id">): Promise<EntityBranchHours> => {
    const { data } = await api.post(endpoint, hours)
    return data
  },

  update: async (id: number, hours: Partial<EntityBranchHours>): Promise<EntityBranchHours> => {
    const { data } = await api.put(`${endpoint}/${id}`, hours)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
