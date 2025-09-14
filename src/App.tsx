import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LocationForm } from "@/components/forms/location-form"
import { EntityStatusForm } from "@/components/forms/entity-status-form"
import { ActivityTypeForm } from "@/components/forms/activity-type-form"
import { EntityTypeForm } from "@/components/forms/entity-type-form"
import { UserForm } from "@/components/forms/user-form"
import { EntityForm } from "@/components/forms/entity-form"
import { EntityBranchForm } from "@/components/forms/entity-branch-form"
import { EntityBranchHoursForm } from "@/components/forms/entity-branch-hours-form"
import { EntityBranchList } from "@/components/lists/entity-branch-list"
import { EntityBranchHoursList } from "@/components/lists/entity-branch-hours-list"
import { LocationList } from "@/components/lists/location-list"
import { EntityStatusList } from "@/components/lists/entity-status-list"
import { UserList } from "@/components/lists/user-list"
import { ActivityTypeList } from "@/components/lists/activity-type-list"
import { EntityTypeList } from "@/components/lists/entity-type-list"
import { EntityList } from "@/components/lists/entities-list"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Toaster } from "./components/ui/toaster"

const sections = [
  { id: "locations-create", label: "Criar Localização", component: LocationForm },
  { id: "locations-manage", label: "Gerir Localizações", component: LocationList },
  { id: "entity-status-create", label: "Criar estado de Entidade", component: EntityStatusForm },
  { id: "entity-status-manage", label: "Gerir estados de Entidade", component: EntityStatusList },
  { id: "activity-types-create", label: "Criar tipo de Actividade", component: ActivityTypeForm },
  { id: "activity-types-manage", label: "Gerir tipos de Actividade", component: ActivityTypeList },
  { id: "entity-types-create", label: "Criar tipo de Entidade", component: EntityTypeForm },
  { id: "entity-types-manage", label: "Gerir tipos de Entidade", component: EntityTypeList },
  { id: "users-create", label: "Criar Usuario", component: UserForm },
  { id: "users-manage", label: "Gerir Usuarios", component: UserList },
  { id: "entities-create", label: "Criar Entidade", component: EntityForm },
  { id: "entities-manage", label: "Gerenciar Entidades", component: EntityList },
  { id: "branches-create", label: "Criar Sucursal", component: EntityBranchForm },
  { id: "branches-manage", label: "Gerenciar Sucursais", component: EntityBranchList },
  { id: "branch-hours-create", label: "Criar Horario", component: EntityBranchHoursForm },
  { id: "branch-hours-manage", label: "Gerenciar Horarios", component: EntityBranchHoursList },
]

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("locations-create")
  const [refreshKey, setRefreshKey] = useState(0)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const savedSection = localStorage.getItem("activeSection")
    if (savedSection && sections.find((s) => s.id === savedSection)) {
      setActiveSection(savedSection)
    }
  }, [])

  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId)
    localStorage.setItem("activeSection", sectionId)
    setIsSidebarOpen(false)
  }

  const handleFormSuccess = () => {
    setRefreshKey((prev) => prev + 1)
  }

  const ActiveComponent = sections.find((s) => s.id === activeSection)?.component || LocationForm

  return (
    <div className="flex min-h-screen bg-background">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b lg:p-6">
          <div>
            <h1 className="text-lg font-bold lg:text-xl">Gestão de Entidades</h1>
            <p className="text-xs text-muted-foreground mt-1 lg:text-sm">Gerencie as Entidades</p>
          </div>
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="p-3 lg:p-4 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="space-y-4 lg:space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Localizações</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("locations-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "locations-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("locations-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "locations-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Status
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("entity-status-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entity-status-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("entity-status-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entity-status-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Tipo de Actividades
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("activity-types-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "activity-types-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("activity-types-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "activity-types-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Tipos de Entidades
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("entity-types-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entity-types-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("entity-types-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entity-types-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Usuarios</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("users-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "users-create" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("users-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "users-manage" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Entidades</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("entities-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entities-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("entities-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "entities-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Sucursais
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("branches-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "branches-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("branches-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "branches-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Horarios
              </h3>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleSectionChange("branch-hours-create")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "branch-hours-create"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Criar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleSectionChange("branch-hours-manage")}
                    className={cn(
                      "w-full text-left px-2 py-2 rounded-md text-sm font-medium transition-colors lg:px-3",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === "branch-hours-manage"
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    Gerenciar
                  </button>
                </li>
              </ul>
            </div>

          </div>
        </nav>
      </aside>

      <main className="flex-1 lg:ml-0">
        <div className="flex items-center justify-between p-4 border-b bg-background lg:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-semibold">{sections.find((s) => s.id === activeSection)?.label}</h2>
          <div className="w-9" />
        </div>

        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 hidden lg:block lg:mb-8">
              <h2 className="text-2xl font-bold mb-2">{sections.find((s) => s.id === activeSection)?.label}</h2>
              <p className="text-muted-foreground">
                {activeSection.includes("manage")
                  ? "Ver e Gerenciar registos"
                  : "Criar novos registos"}
              </p>
            </div>

            <ActiveComponent key={`${activeSection}-${refreshKey}`} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
