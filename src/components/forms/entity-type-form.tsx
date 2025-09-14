import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { EntityType } from "@/types/entities"
import { entityTypeService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface EntityTypeFormProps {
  entityType?: EntityType
  onSuccess?: () => void
}

export function EntityTypeForm({ entityType, onSuccess }: EntityTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<EntityType, "id">>({
    defaultValues: entityType
      ? { ...entityType }
      : {
          name: "",
          description: "",
          is_active: true,
        },
  })

  const onSubmit = async (data: Omit<EntityType, "id">) => {
    setIsLoading(true)
    try {
      if (entityType?.id) {
        await entityTypeService.update(entityType.id, data)
        toast({
          title: "Sucesso",
          description: "Tipo de entidade atualizado com sucesso",
        })
      } else {
        await entityTypeService.create(data)
        toast({
          title: "Sucesso",
          description: "Tipo de entidade criado com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar o tipo de entidade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entityType ? "Editar Tipo de Entidade" : "Criar Tipo de Entidade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name", { required: "Nome é obrigatório" })} placeholder="Nome do tipo de entidade" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" {...register("description")} placeholder="Descrição do tipo de entidade" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isactive"
              checked={watch("is_active")}
              onCheckedChange={(checked) => setValue("is_active", !!checked)}
            />
            <Label htmlFor="isactive">Ativo</Label>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : entityType ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}