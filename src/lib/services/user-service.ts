import api from "./axios"
import type { User } from "@/types/entities"

const endpoint = "/users"

export const userService = {
  getAll: async (): Promise<User[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<User> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    const { data } = await api.post(endpoint, user)
    return data
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    const { data } = await api.put(`${endpoint}/${id}`, user)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
