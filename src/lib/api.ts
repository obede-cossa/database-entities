import axios from "axios"
import type {
  Entity,
  User,
  EntityType,
  EntityBranch,
  Location,
  ActivityType,
  EntityStatus,
  EntityBranchHours,
} from "@/types/entities"


const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
})

export class ApiService<T> {
  private endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
   }

  async getAll(): Promise<T[]> {
    const response = await api.get(`/${this.endpoint}`)
    return response.data
  }

  async getById(id: number): Promise<T> {
    const response = await api.get(`/${this.endpoint}/${id}`)
    return response.data
  }

  async create(data: Omit<T, "id">): Promise<T> {
    const response = await api.post(`/${this.endpoint}`, data)
    return response.data
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    const response = await api.put(`/${this.endpoint}/${id}`, data)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/${this.endpoint}/${id}`)
  }
}

export const entityService = new ApiService<Entity>("entities")
export const userService = new ApiService<User>("users")
export const entityTypeService = new ApiService<EntityType>("entity-types")
export const entityBranchService = new ApiService<EntityBranch>("entity-branches")
export const locationService = new ApiService<Location>("locations")
export const activityTypeService = new ApiService<ActivityType>("activity-types")
export const entityStatusService = new ApiService<EntityStatus>("entity-status")
export const branchHoursService = new ApiService<EntityBranchHours>("branch-hours")
