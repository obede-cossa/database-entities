// entities.ts

// Location entity
export interface Location {
  id: number
  parent_id?: number
  name: string
  is_province: boolean
  is_capital_city: boolean
  is_municipality: boolean
  is_active: boolean
}

// EntityStatus entity
export interface EntityStatus {
  id: number
  name: string
  description?: string
  is_active: boolean
}

// ActivityType entity
export interface ActivityType {
  id: number
  code: string
  class_code?: string
  group_code?: string
  division_code?: string
  section_code?: string
  description: string
  is_active: boolean
}

// EntityType entity
export interface EntityType {
  id: number
  name: string
  description?: string
  is_active: boolean
}

// User entity
export interface User {
  id: number
  email: string
  nickname?: string
  firstname: string
  lastname: string
  phone?: string
  dateofbirth?: string
  gender?: "M" | "F" | "O"
  password: string
  expirydate: string
  usertypeid: number
  entityid?: number
  mfaactive: boolean
  is_active: boolean
  isdeleted: boolean
  createdon: string
  createdby: number
  lastupdatedon?: string
  lastupdatedby?: number
}

// EntityBranchHours entity
export interface EntityBranchHours {
  id: number
  branchid: number
  weekday: string
  opentime: string
  closetime?: string
}

// EntityBranch entity
export interface EntityBranch {
  id: number
  entityid: number
  is_main: boolean
  address?: string
  postcode?: string
  locationid: number
  phone?: string
  contactname?: string
  contactphone?: string
  contactemail?: string
  gpslat?: string
  gpslong?: string
  openonholidays: boolean
  holidaysopentime?: string
  holidaysclosetime?: string
  entitystatusid: number
  is_deleted: boolean
  createdon: string
  createdby: number
  lastupdatedon?: string
  lastupdatedby?: number
}

// Main Entity entity
export interface Entity {
  id: number
  officialname: string
  preferredname?: string
  nuit: string
  ssnumber: string
  registrationnumber: string
  registrationdate: string
  activitystartdate?: string
  entitytypeid: number
  activitytypeid: number
  website?: string
  email?: string
  phone?: string
  logofile?: any // bytea would typically be handled as binary data
  picture?: any // bytea would typically be handled as binary data
  entitystatusid: number
  isdeleted: boolean
  createdon: string
  createdby: number
  lastupdatedon?: string
  lastupdatedby?: number
}

// Complete database schema
export interface DatabaseSchema {
  entities: Entity[]
  users: User[]
  entity_types: EntityType[]
  entity_branches: EntityBranch[]
  locations: Location[]
  activity_types: ActivityType[]
  entity_status: EntityStatus[]
  branch_hours: EntityBranchHours[]
}
