import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Location } from "@/types/entities"
import { locationService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface LocationFormProps {
  location?: Location
  onSuccess?: () => void
}

export function LocationForm({ location, onSuccess }: LocationFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<Location, "id">>({
    defaultValues: location
      ? { ...location }
      : {
          name: "",
          is_province: false,
          is_capital_city: false,
          is_municipality: false,
          is_active: true,
        },
  })

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      const data = await locationService.getAll()
      setLocations(Array.isArray(data) ? data : [])
    } catch (error) {
      setLocations([])
      toast({
        title: "Erro",
        description: "Falha ao carregar localizações",
        variant: "destructive",
      })
    }
  }

  const onSubmit = async (data: Omit<Location, "id">) => {
    setIsLoading(true)
    try {
      if (location?.id) {
        await locationService.update(location.id, data)
        toast({
          title: "Sucesso",
          description: "Localização atualizada com sucesso",
        })
      } else {
        await locationService.create(data)
        toast({
          title: "Sucesso",
          description: "Localização criada com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar localização",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{location ? "Editar Localização" : "Criar Localização"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome</Label>
            <Input id="name" {...register("name", { required: "Nome é obrigatorio" })} placeholder="Nome da localização" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="parentid">Localização parente</Label>
            <Select onValueChange={(value) => setValue("parent_id", value ? Number.parseInt(value) : undefined)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma localização parente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Nenhuma</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id.toString()}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isprovince"
                checked={watch("is_province")}
                onCheckedChange={(checked) => setValue("is_province", !!checked)}
              />
              <Label htmlFor="isprovince">Provincia</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="iscapitalcity"
                checked={watch("is_capital_city")}
                onCheckedChange={(checked) => setValue("is_capital_city", !!checked)}
              />
              <Label htmlFor="iscapitalcity">Capital</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="ismunicipality"
                checked={watch("is_municipality")}
                onCheckedChange={(checked) => setValue("is_municipality", !!checked)}
              />
              <Label htmlFor="ismunicipality">Municipio</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isactive"
                checked={watch("is_active")}
                onCheckedChange={(checked) => setValue("is_active", !!checked)}
              />
              <Label htmlFor="isactive">Activa</Label>
            </div>
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : location ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
