import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { userService } from "@/lib/services"
import type { User } from "@/types/entities"
import { UserForm } from "@/components/forms/user-form"

interface UserListProps {
  onSuccess?: () => void
}

export function UserList({ onSuccess }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getAll()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Falha ao carregar usuários:", error)
      toast({
        title: "Erro",
        description: "Falha ao carregar usuários",
        variant: "destructive",
      })
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      await userService.delete(id)
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      })
      loadUsers()
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao excluir usuário",
        variant: "destructive",
      })
    }
  }

  const handleFormSuccess = () => {
    setEditingUser(null)
    setShowForm(false)
    loadUsers()
    onSuccess?.()
  }

  useEffect(() => {
    loadUsers()
  }, [])

  if (showForm || editingUser) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">{editingUser ? "Editar Usuário" : "Criar Usuário"}</h3>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingUser(null)
            }}
          >
            Voltar para a Lista
          </Button>
        </div>
        <UserForm user={editingUser || undefined} onSuccess={handleFormSuccess} />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Usuários</CardTitle>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Carregando usuários...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum usuário encontrado. Crie seu primeiro usuário para começar.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Entidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {user.firstname} {user.lastname}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>{user.entityid || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={user.isactive ? "default" : "secondary"}>
                      {user.isactive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(user.id!)}>
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