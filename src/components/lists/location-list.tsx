import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { locationService } from "@/lib/services"
import type { Location } from "@/types/entities"
import { LocationForm } from "@/components/forms/location-form"

interface LocationListProps {
  onSuccess?: () => void
}

export function LocationList({ onSuccess }: LocationListProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadLocations = async () => {
    try {
      setLoading(true)
      const data = await locationService.getAll()
      setLocations(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Falha ao carregar localizações:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar localizações",
        variant: "destructive",
      })
      setLocations([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta localização?")) return

    try {
      await locationService.delete(id)
      toast({
        title: "Sucesso",
        description: "Localização excluída com sucesso",
      })
      loadLocations()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir localização",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setEditingLocation(null)
    setShowForm(false)
    loadLocations()
    onSuccess?.()
  }

  useEffect(() => {
    loadLocations()
  }, [])

  if (showForm || editingLocation) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingLocation ? "Editar Localização" : "Criar Localização"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingLocation(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <LocationForm location={editingLocation || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Localizações</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Localização
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando localizações...</div>
        ) : locations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma localização encontrada. Crie sua primeira localização para começar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>País</TableHead>
                <TableHead>Estado/Província</TableHead>
                <TableHead>Cidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>{location.iscapitalcity}</TableCell>
                  <TableCell>{location.ismunicipality}</TableCell>
                  <TableCell>{location.isprovince}</TableCell>
                  <TableCell>
                    <Badge variant={location.isactive ? "default" : "secondary"}>
                      {location.isactive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingLocation(location)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(location.id!)}>
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