"use client"

import { useState, useEffect } from "react"
import type { EntityBranch, Location, Entity, EntityStatus } from "@/types/entities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, MapPin } from "lucide-react"
import { EntityBranchForm } from "@/components/forms/entity-branch-form"
import { entityBranchService, entityService, entityStatusService, locationService } from "@/lib/services"
import { toast } from "@/hooks/use-toast"

export function EntityBranchList() {
  const [branches, setBranches] = useState<EntityBranch[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [entityStatuses, setEntityStatuses] = useState<EntityStatus[]>([])
  const [editingBranch, setEditingBranch] = useState<EntityBranch | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [branchesData, entitiesData, locationsData, statusesData] = await Promise.all([
        entityBranchService.getAll(),
        entityService.getAll(),
        locationService.getAll(),
        entityStatusService.getAll(),
      ])
      setBranches(Array.isArray(branchesData) ? branchesData : [])
      setEntities(Array.isArray(entitiesData) ? entitiesData : [])
      setLocations(Array.isArray(locationsData) ? locationsData : [])
      setEntityStatuses(Array.isArray(statusesData) ? statusesData : [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar filiais",
        variant: "destructive",
      })
      setBranches([])
      setEntities([])
      setLocations([])
      setEntityStatuses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta filial?")) {
      try {
        await entityBranchService.delete(id)
        toast({
          title: "Sucesso",
          description: "Filial excluída com sucesso",
        })
        setBranches(branches.filter((branch) => branch.id !== id))
      } catch (error) {
        console.error("Erro ao excluir filial:", error)
        toast({
          title: "Erro",
          description: "Falha ao excluir filial",
          variant: "destructive",
        })
      }
    }
  }

  const handleFormSuccess = () => {
    setEditingBranch(null)
    setShowForm(false)
    fetchData()
  }

  const getEntityName = (entityId: number) => {
    const entity = entities.find((e) => e.id === entityId)
    return entity?.preferredname || entity?.officialname || "Entidade Desconhecida"
  }

  const getLocationName = (locationId: number) => {
    const location = locations.find((l) => l.id === locationId)
    return location?.name || "Localização Desconhecida"
  }

  const getStatusName = (statusId: number) => {
    const status = entityStatuses.find((s) => s.id === statusId)
    return status?.name || "Status Desconhecido"
  }

  if (showForm || editingBranch) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingBranch ? "Editar Filial" : "Criar Filial"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingBranch(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <EntityBranchForm entityBranch={editingBranch || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando filiais...</div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filiais</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Filial
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {branches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nenhuma filial encontrada. Crie sua primeira filial para começar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entidade</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell className="font-medium">{getEntityName(branch.entityid)}</TableCell>
                  <TableCell>{getLocationName(branch.locationid)}</TableCell>
                  <TableCell>{branch.address || "-"}</TableCell>
                  <TableCell>{branch.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusName(branch.entitystatusid) === "Ativo" ? "default" : "secondary"}>
                      {getStatusName(branch.entitystatusid)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={branch.ismain ? "default" : "outline"}>
                      {branch.ismain ? "Sim" : "Não"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingBranch(branch)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(branch.id!)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}