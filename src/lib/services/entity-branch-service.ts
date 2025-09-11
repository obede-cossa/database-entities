import api from "./axios"
import type { EntityBranch } from "@/types/entities"

const endpoint = "/entity-branches"

export const entityBranchService = {
  getAll: async (): Promise<EntityBranch[]> => {
    const { data } = await api.get(endpoint)
    return data
  },

  getById: async (id: number): Promise<EntityBranch> => {
    const { data } = await api.get(`${endpoint}/${id}`)
    return data
  },

  create: async (branch: Omit<EntityBranch, "id">): Promise<EntityBranch> => {
    const { data } = await api.post(endpoint, branch)
    return data
  },

  update: async (id: number, branch: Partial<EntityBranch>): Promise<EntityBranch> => {
    const { data } = await api.put(`${endpoint}/${id}`, branch)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${endpoint}/${id}`)
  },
}
