import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { activityTypeService } from "@/lib/services"
import type { ActivityType } from "@/types/entities"
import { ActivityTypeForm } from "@/components/forms/activity-type-form"

interface ActivityTypeListProps {
  onSuccess?: () => void
}

export function ActivityTypeList({ onSuccess }: ActivityTypeListProps) {
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingType, setEditingType] = useState<ActivityType | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadActivityTypes = async () => {
    try {
      setLoading(true)
      const data = await activityTypeService.getAll()
      setActivityTypes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Falha ao carregar tipos de atividade:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar tipos de atividade",
        variant: "destructive",
      })
      setActivityTypes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este tipo de atividade?")) return

    try {
      await activityTypeService.delete(id)
      toast({
        title: "Sucesso",
        description: "Tipo de atividade excluído com sucesso",
      })
      loadActivityTypes()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir tipo de atividade",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setEditingType(null)
    setShowForm(false)
    loadActivityTypes()
    onSuccess?.()
  }

  useEffect(() => {
    loadActivityTypes()
  }, [])

  if (showForm || editingType) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingType ? "Editar Tipo de Atividade" : "Criar Tipo de Atividade"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingType(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <ActivityTypeForm activityType={editingType || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tipos de Atividade</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Tipo de Atividade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando tipos de atividade...</div>
        ) : activityTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tipo de atividade encontrado. Crie seu primeiro tipo de atividade para começar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead>Nome</TableHead> */}
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={type.active ? "default" : "secondary"}>
                      {type.active ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingType(type)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(type.id!)}>
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