"use client"

import { useState, useEffect } from "react"
import type { EntityBranchHours, EntityBranch, Entity } from "@/types/entities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2, Plus, Clock } from "lucide-react"
import { EntityBranchHoursForm } from "@/components/forms/entity-branch-hours-form"
import { branchHoursService, entityBranchService, entityService } from "@/lib/services"
import { toast } from "@/hooks/use-toast"

const WEEKDAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

export function EntityBranchHoursList() {
  const [hours, setHours] = useState<EntityBranchHours[]>([])
  const [branches, setBranches] = useState<EntityBranch[]>([])
  const [entities, setEntities] = useState<Entity[]>([])
  const [editingHours, setEditingHours] = useState<EntityBranchHours | null>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [hoursData, branchesData, entitiesData] = await Promise.all([
        branchHoursService.getAll(),
        entityBranchService.getAll(),
        entityService.getAll(),
      ])
      setHours(Array.isArray(hoursData) ? hoursData : [])
      setBranches(Array.isArray(branchesData) ? branchesData : [])
      setEntities(Array.isArray(entitiesData) ? entitiesData : [])
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar horários",
        variant: "destructive",
      })
      setHours([])
      setBranches([])
      setEntities([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir estes horários?")) {
      try {
        await branchHoursService.delete(id)
        toast({
          title: "Sucesso",
          description: "Horários excluídos com sucesso",
        })
        setHours(hours.filter((h) => h.id !== id))
      } catch (error) {
        console.error("Erro ao excluir horários:", error)
        toast({
          title: "Erro",
          description: "Falha ao excluir horários",
          variant: "destructive",
        })
      }
    }
  }

  const handleFormSuccess = () => {
    setEditingHours(null)
    setShowForm(false)
    fetchData()
  }

  const getBranchInfo = (branchId: number) => {
    const branch = branches.find((b) => b.id === branchId)
    if (!branch) return { name: "Filial Desconhecida", entity: "Entidade Desconhecida" }

    const entity = entities.find((e) => e.id === branch.entityid)
    return {
      name: branch.ismain ? "Filial Principal" : `Filial ${branch.id}`,
      entity: entity?.preferredname || entity?.officialname || "Entidade Desconhecida",
    }
  }

  const formatTime = (time: string) => {
    if (!time) return "Não definido"
    return time
  }

  if (showForm || editingHours) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingHours ? "Editar Horários" : "Criar Horários"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingHours(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <EntityBranchHoursForm branchHours={editingHours || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Carregando horários...</div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Horários das Filiais</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Horários
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {hours.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Nenhum horário encontrado. Configure os horários de funcionamento das suas filiais.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Entidade</TableHead>
                <TableHead>Filial</TableHead>
                <TableHead>Dia da Semana</TableHead>
                <TableHead>Horário de Abertura</TableHead>
                <TableHead>Horário de Fechamento</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.map((hour) => {
                const branchInfo = getBranchInfo(hour.branchid)
                return (
                  <TableRow key={hour.id}>
                    <TableCell className="font-medium">{branchInfo.entity}</TableCell>
                    <TableCell>{branchInfo.name}</TableCell>
                    <TableCell>{WEEKDAYS.find(day => day.toLowerCase().includes(hour.weekday.toLowerCase())) || hour.weekday}</TableCell>
                    <TableCell>{formatTime(hour.opentime)}</TableCell>
                    <TableCell>{formatTime(hour.closetime) || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setEditingHours(hour)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(hour.id!)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}