import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { entityTypeService } from "@/lib/services"
import type { EntityType } from "@/types/entities"
import { EntityTypeForm } from "@/components/forms/entity-type-form"

interface EntityTypeListProps {
  onSuccess?: () => void
}

export function EntityTypeList({ onSuccess }: EntityTypeListProps) {
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingType, setEditingType] = useState<EntityType | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadEntityTypes = async () => {
    try {
      setLoading(true)
      const data = await entityTypeService.getAll()
      setEntityTypes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Falha ao carregar tipos de entidade:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar tipos de entidade",
        variant: "destructive",
      })
      setEntityTypes([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este tipo de entidade?")) return

    try {
      await entityTypeService.delete(id)
      toast({
        title: "Sucesso",
        description: "Tipo de entidade excluído com sucesso",
      })
      loadEntityTypes()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir tipo de entidade",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setEditingType(null)
    setShowForm(false)
    loadEntityTypes()
    onSuccess?.()
  }

  useEffect(() => {
    loadEntityTypes()
  }, [])

  if (showForm || editingType) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingType ? "Editar Tipo de Entidade" : "Criar Tipo de Entidade"}</h3>
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
        <EntityTypeForm entityType={editingType || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tipos de Entidade</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Tipo de Entidade
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando tipos de entidade...</div>
        ) : entityTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum tipo de entidade encontrado. Crie seu primeiro tipo de entidade para começar.
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
              {entityTypes.map((type) => (
                <TableRow key={type.id}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={type.isactive ? "default" : "secondary"}>
                      {type.isactive ? "Ativo" : "Inativo"}
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