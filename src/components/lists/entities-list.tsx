"use client"

import { useState, useEffect } from "react"
import type { Entity, EntityType, ActivityType, EntityStatus } from "@/types/entities"
import { entityService, entityTypeService, activityTypeService, entityStatusService } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, Building2 } from "lucide-react"
import { EntityForm } from "@/components/forms/entity-form"
import { toast } from "@/hooks/use-toast"

interface EntityListProps {
  onSuccess?: () => void
}

export function EntityList({ onSuccess }: EntityListProps) {
  const [entities, setEntities] = useState<Entity[]>([])
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([])
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [entityStatuses, setEntityStatuses] = useState<EntityStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEntity, setEditingEntity] = useState<Entity | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [entitiesData, entityTypesData, activityTypesData, entityStatusesData] = await Promise.all([
        entityService.getAll(),
        entityTypeService.getAll(),
        activityTypeService.getAll(),
        entityStatusService.getAll(),
      ])

      setEntities(Array.isArray(entitiesData) ? entitiesData : [])
      setEntityTypes(Array.isArray(entityTypesData) ? entityTypesData : [])
      setActivityTypes(Array.isArray(activityTypesData) ? activityTypesData : [])
      setEntityStatuses(Array.isArray(entityStatusesData) ? entityStatusesData : [])
    } catch (error) {
      console.error("Falha ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar entidades",
        variant: "destructive",
      })
      setEntities([])
      setEntityTypes([])
      setActivityTypes([])
      setEntityStatuses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta entidade?")) {
      try {
        await entityService.delete(id)
        toast({
          title: "Sucesso",
          description: "Entidade excluída com sucesso",
        })
        await fetchData()
        onSuccess?.()
      } catch (error) {
        console.error("Falha ao excluir entidade:", error)
        toast({
          title: "Erro",
          description: "Falha ao excluir entidade",
          variant: "destructive",
        })
      }
    }
  }

  const handleFormSuccess = () => {
    setEditingEntity(null)
    setShowForm(false)
    fetchData()
    onSuccess?.()
  }

  const getEntityTypeName = (id: number) => {
    return entityTypes.find((type) => type.id === id)?.name || "Desconhecido"
  }

  const getActivityTypeName = (id: number) => {
    return activityTypes.find((type) => type.id === id)?.description || "Desconhecido"
  }

  const getEntityStatusName = (id: number) => {
    return entityStatuses.find((status) => status.id === id)?.name || "Desconhecido"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  if (showForm || editingEntity) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingEntity ? "Editar Entidade" : "Criar Entidade"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingEntity(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <EntityForm entity={editingEntity || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando entidades...</div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Entidades</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Entidade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Building2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nenhuma entidade encontrada. Crie sua primeira entidade para começar.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Atividade</TableHead>
                <TableHead>Data de Registro</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((entity) => (
                <TableRow key={entity.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{entity.preferredname || entity.officialname}</div>
                      {entity.preferredname && (
                        <div className="text-sm text-muted-foreground">{entity.officialname}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getEntityTypeName(entity.entitytypeid)}</TableCell>
                  <TableCell>{getActivityTypeName(entity.activitytypeid)}</TableCell>
                  <TableCell>{formatDate(entity.registrationdate)}</TableCell>
                  <TableCell>
                    <Badge variant={entity.isdeleted ? "destructive" : "default"}>
                      {getEntityStatusName(entity.entitystatusid)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingEntity(entity)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(entity.id!)}>
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