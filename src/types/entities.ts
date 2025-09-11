// entities.ts

// Location entity
export interface Location {
  id: number
  parentid?: number
  name: string
  isprovince: boolean
  iscapitalcity: boolean
  ismunicipality: boolean
  isactive: boolean
}

// EntityStatus entity
export interface EntityStatus {
  id: number
  name: string
  description?: string
  isactive: boolean
}

// ActivityType entity
export interface ActivityType {
  id: number
  code: string
  classcode?: string
  groupcode?: string
  divisioncode?: string
  sectioncode?: string
  description: string
  isactive: boolean
}

// EntityType entity
export interface EntityType {
  id: number
  name: string
  description?: string
  isactive: boolean
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
  isactive: boolean
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
  ismain: boolean
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
  isdeleted: boolean
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
