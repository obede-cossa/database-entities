import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import type { ActivityType } from "@/types/entities"
import { activityTypeService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface ActivityTypeFormProps {
  activityType?: ActivityType
  onSuccess?: () => void
}

export function ActivityTypeForm({ activityType, onSuccess }: ActivityTypeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<ActivityType, "id">>({
    defaultValues: activityType
      ? { ...activityType }
      : {
          code: "",
          classcode: "",
          groupcode: "",
          divisioncode: "",
          sectioncode: "",
          description: "",
          isactive: true,
        },
  })

  const onSubmit = async (data: Omit<ActivityType, "id">) => {
    setIsLoading(true)
    try {
      if (activityType?.id) {
        await activityTypeService.update(activityType.id, data)
        toast({
          title: "Sucesso",
          description: "Tipo de atividade atualizado com sucesso",
        })
      } else {
        await activityTypeService.create(data)
        toast({
          title: "Sucesso",
          description: "Tipo de atividade criado com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar tipo de atividade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{activityType ? "Editar Tipo de Atividade" : "Criar Tipo de Atividade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" {...register("code", { required: "Código é obrigatório" })} placeholder="Código da atividade" />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            <div>
              <Label htmlFor="classcode">Código de Classe</Label>
              <Input id="classcode" {...register("classcode")} placeholder="Código de classe" />
            </div>

            <div>
              <Label htmlFor="groupcode">Código de Grupo</Label>
              <Input id="groupcode" {...register("groupcode")} placeholder="Código de grupo" />
            </div>

            <div>
              <Label htmlFor="divisioncode">Código de Divisão</Label>
              <Input id="divisioncode" {...register("divisioncode")} placeholder="Código de divisão" />
            </div>

            <div>
              <Label htmlFor="sectioncode">Código de Seção</Label>
              <Input id="sectioncode" {...register("sectioncode")} placeholder="Código de seção" />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description", { required: "Descrição é obrigatória" })}
              placeholder="Descrição da atividade"
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
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
            {isLoading ? "Salvando..." : activityType ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}