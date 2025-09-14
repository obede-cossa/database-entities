import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, Entity } from "@/types/entities"
import { userService, entityService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface UserFormProps {
  user?: User
  onSuccess?: () => void
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [entities, setEntities] = useState<Entity[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<User, "id">>({
    defaultValues: user
      ? { ...user }
      : {
          email: "",
          nickname: "",
          firstname: "",
          lastname: "",
          phone: "",
          dateofbirth: "",
          gender: undefined,
          password: "",
          expirydate: "",
          usertypeid: 1,
          entityid: undefined,
          mfaactive: false,
          is_active: true,
          isdeleted: false,
          createdon: new Date().toISOString()
        },
  })

  useEffect(() => {
    loadEntities()
  }, [])

  const loadEntities = async () => {
    try {
      const data = await entityService.getAll()
      setEntities(Array.isArray(data) ? data : [])
    } catch (error) {
      setEntities([])
      toast({
        title: "Erro",
        description: "Falha ao carregar entidades",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: Omit<User, "id">) => {
    setIsLoading(true)
    try {
      if (user?.id) {
        await userService.update(user.id, data)
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        })
      } else {
        await userService.create(data)
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar usuário",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user ? "Editar Usuário" : "Criar Usuário"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstname">Nome</Label>
              <Input
                id="firstname"
                {...register("firstname", { required: "Nome é obrigatório" })}
                placeholder="Nome"
              />
              {errors.firstname && <p className="text-sm text-destructive">{errors.firstname.message}</p>}
            </div>

            <div>
              <Label htmlFor="lastname">Sobrenome</Label>
              <Input
                id="lastname"
                {...register("lastname", { required: "Sobrenome é obrigatório" })}
                placeholder="Sobrenome"
              />
              {errors.lastname && <p className="text-sm text-destructive">{errors.lastname.message}</p>}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Endereço de email inválido",
                  },
                })}
                placeholder="Endereço de email"
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="nickname">Apelido</Label>
              <Input id="nickname" {...register("nickname")} placeholder="Apelido" />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} placeholder="Número de telefone" />
            </div>

            <div>
              <Label htmlFor="dateofbirth">Data de Nascimento</Label>
              <Input id="dateofbirth" type="date" {...register("dateofbirth")} />
            </div>

            <div>
              <Label htmlFor="gender">Gênero</Label>
              <Select onValueChange={(value) => setValue("gender", value as "M" | "F" | "O")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">Masculino</SelectItem>
                  <SelectItem value="F">Feminino</SelectItem>
                  <SelectItem value="O">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                {...register("password", { required: "Senha é obrigatória" })}
                placeholder="Senha"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <Label htmlFor="expirydate">Data de Expiração</Label>
              <Input id="expirydate" type="date" {...register("expirydate", { required: "Data de expiração é obrigatória" })} />
              {errors.expirydate && <p className="text-sm text-destructive">{errors.expirydate.message}</p>}
            </div>

            <div>
              <Label htmlFor="usertypeid">ID do Tipo de Usuário</Label>
              <Input
                id="usertypeid"
                type="number"
                {...register("usertypeid", { required: "ID do tipo de usuário é obrigatório" })}
                placeholder="ID do tipo de usuário"
              />
              {errors.usertypeid && <p className="text-sm text-destructive">{errors.usertypeid.message}</p>}
            </div>

            <div>
              <Label htmlFor="entityid">Entidade</Label>
              <Select onValueChange={(value) => setValue("entityid", value ? Number.parseInt(value) : undefined)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar entidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Nenhuma</SelectItem>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id.toString()}>
                      {entity.officialname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="mfaactive"
                checked={watch("mfaactive")}
                onCheckedChange={(checked) => setValue("mfaactive", !!checked)}
              />
              <Label htmlFor="mfaactive">MFA Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isactive"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", !!checked)}
              />
              <Label htmlFor="isactive">Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isdeleted"
                checked={watch("isdeleted")}
                onCheckedChange={(checked) => setValue("isdeleted", !!checked)}
              />
              <Label htmlFor="isdeleted">Excluído</Label>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : user ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}