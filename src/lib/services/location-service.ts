import api from "./axios"
import type { Location } from "@/types/entities"

const endpoint = "/locations"

export const locationService = {
  getAll: async (): Promise<Location[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<Location> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (location: Omit<Location, "id">): Promise<Location> => {
    const { data } = await api.post(endpoint, location)
    return data
  },

  update: async (id: number, location: Partial<Location>): Promise<Location> => {
    const { data } = await api.put(`${endpoint}/${id}`, location)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
