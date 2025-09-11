import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { entityStatusService } from "@/lib/services"
import type { EntityStatus } from "@/types/entities"
import { EntityStatusForm } from "@/components/forms/entity-status-form"

interface EntityStatusListProps {
  onSuccess?: () => void
}

export function EntityStatusList({ onSuccess }: EntityStatusListProps) {
  const [entityStatuses, setEntityStatuses] = useState<EntityStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStatus, setEditingStatus] = useState<EntityStatus | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadEntityStatuses = async () => {
    try {
      setLoading(true)
      const data = await entityStatusService.getAll()
      setEntityStatuses(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Falha ao carregar status de entidades:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar status de entidades",
        variant: "destructive",
      })
      setEntityStatuses([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este status de entidade?")) return

    try {
      await entityStatusService.delete(id)
      toast({
        title: "Sucesso",
        description: "Status de entidade excluído com sucesso",
      })
      loadEntityStatuses()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir status de entidade",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setEditingStatus(null)
    setShowForm(false)
    loadEntityStatuses()
    onSuccess?.()
  }

  useEffect(() => {
    loadEntityStatuses()
  }, [])

  if (showForm || editingStatus) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingStatus ? "Editar Status de Entidade" : "Criar Status de Entidade"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingStatus(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <EntityStatusForm entityStatus={editingStatus || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Status de Entidades</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Status
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando status de entidades...</div>
        ) : entityStatuses.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum status de entidade encontrado. Crie seu primeiro status para começar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entityStatuses.map((status) => (
                <TableRow key={status.id}>
                  <TableCell className="font-medium">{status.name}</TableCell>
                  <TableCell>{status.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={status.isactive ? "default" : "secondary"}>
                      {status.isactive ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingStatus(status)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(status.id!)}>
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