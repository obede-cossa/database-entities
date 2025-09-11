import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EntityBranchHours, EntityBranch } from "@/types/entities"
import { branchHoursService, entityBranchService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface EntityBranchHoursFormProps {
  branchHours?: EntityBranchHours
  onSuccess?: () => void
}

const weekdays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"]

export function EntityBranchHoursForm({ branchHours, onSuccess }: EntityBranchHoursFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [branches, setBranches] = useState<EntityBranch[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Omit<EntityBranchHours, "id">>({
    defaultValues: branchHours
      ? { ...branchHours }
      : {
          branchid: 1,
          weekday: "Segunda-feira",
          opentime: "",
          closetime: "",
        },
  })

  useEffect(() => {
    loadBranches()
  }, [])

  const loadBranches = async () => {
    try {
      const data = await entityBranchService.getAll()
      setBranches(Array.isArray(data) ? data : [])
    } catch (error) {
      setBranches([])
      toast({
        title: "Erro",
        description: "Falha ao carregar filiais",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: Omit<EntityBranchHours, "id">) => {
    setIsLoading(true)
    console.log(data)
    try {
      if (branchHours?.id) {
        await branchHoursService.update(branchHours.id, data)
        toast({
          title: "Sucesso",
          description: "Horários da filial atualizados com sucesso",
        })
      } else {
        await branchHoursService.create(data)
        toast({
          title: "Sucesso",
          description: "Horários da filial criados com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar horários da filial",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{branchHours ? "Editar Horários da Filial" : "Criar Horários da Filial"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="branchid">Filial</Label>
            <Select onValueChange={(value) => setValue("branchid", Number.parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar filial" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    Filial {branch.id} - {branch.address || "Sem endereço"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="weekday">Dia da Semana</Label>
            <Select onValueChange={(value) => setValue("weekday", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar dia da semana" />
              </SelectTrigger>
              <SelectContent>
                {weekdays.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="opentime">Horário de Abertura</Label>
              <Input id="opentime" type="time" {...register("opentime", { required: "Horário de abertura é obrigatório" })} />
              {errors.opentime && <p className="text-sm text-destructive">{errors.opentime.message}</p>}
            </div>

            <div>
              <Label htmlFor="closetime">Horário de Fechamento</Label>
              <Input id="closetime" type="time" {...register("closetime")} />
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : branchHours ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}