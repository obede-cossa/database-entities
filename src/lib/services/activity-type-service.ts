import api from "./axios"
import type { ActivityType } from "@/types/entities"

const endpoint = "/activity-types"

export const activityTypeService = {
  getAll: async (): Promise<ActivityType[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<ActivityType> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (activity: Omit<ActivityType, "id">): Promise<ActivityType> => {
    const { data } = await api.post(endpoint, activity)
    return data
  },

  update: async (id: number, activity: Partial<ActivityType>): Promise<ActivityType> => {
    const { data } = await api.put(`${endpoint}/${id}`, activity)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
