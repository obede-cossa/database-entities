import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { EntityStatus } from "@/types/entities"
import { entityStatusService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface EntityStatusFormProps {
  entityStatus?: EntityStatus
  onSuccess?: () => void
}

export function EntityStatusForm({ entityStatus, onSuccess }: EntityStatusFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<EntityStatus, "id">>({
    defaultValues: entityStatus
      ? { ...entityStatus }
      : {
          name: "",
          description: "",
          isactive: true,
        },
  })

  const onSubmit = async (data: Omit<EntityStatus, "id">) => {
    setIsLoading(true)
    try {
      if (entityStatus?.id) {
        await entityStatusService.update(entityStatus.id, data)
        toast({
          title: "Sucesso",
          description: "Status da entidade atualizado com sucesso",
        })
      } else {
        await entityStatusService.create(data)
        toast({
          title: "Sucesso",
          description: "Status da entidade criado com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o status da entidade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entityStatus ? "Editar Status da Entidade" : "Criar Status da Entidade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name", { required: "Nome é obrigatório" })} placeholder="Nome do status" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} placeholder="Descrição do status" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isactive"
              checked={watch("isactive")}
              onCheckedChange={(checked) => setValue("isactive", !!checked)}
            />
            <Label htmlFor="isactive">Ativo</Label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : entityStatus ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}