import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Entity, EntityType, ActivityType, EntityStatus } from "@/types/entities"
import { entityService, entityTypeService, activityTypeService, entityStatusService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface EntityFormProps {
  entity?: Entity
  onSuccess?: () => void
}

export function EntityForm({ entity, onSuccess }: EntityFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [entityTypes, setEntityTypes] = useState<EntityType[]>([])
  const [activityTypes, setActivityTypes] = useState<ActivityType[]>([])
  const [entityStatuses, setEntityStatuses] = useState<EntityStatus[]>([])
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [picturePreview, setPicturePreview] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<Entity, "id">>({
    defaultValues: entity
      ? { ...entity }
      : {
          officialname: "",
          preferredname: "",
          nuit: "",
          ssnumber: "",
          registrationnumber: "",
          registrationdate: "",
          activitystartdate: "",
          entitytypeid: 1,
          activitytypeid: 1,
          website: "",
          email: "",
          phone: "",
          entitystatusid: 1,
          isdeleted: false,
          createdon: new Date().toISOString(),
        },
  })

  useEffect(() => {
    loadRelatedData()
  }, [])

  const loadRelatedData = async () => {
    try {
      const [entityTypesData, activityTypesData, entityStatusesData] = await Promise.all([
        entityTypeService.getAll(),
        activityTypeService.getAll(),
        entityStatusService.getAll(),
      ])
      setEntityTypes(Array.isArray(entityTypesData) ? entityTypesData : [])
      setActivityTypes(Array.isArray(activityTypesData) ? activityTypesData : [])
      setEntityStatuses(Array.isArray(entityStatusesData) ? entityStatusesData : [])
    } catch (error) {
      setEntityTypes([])
      setActivityTypes([])
      setEntityStatuses([])
      toast({
        title: "Erro",
        description: "Falha ao carregar dados relacionados",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, type: "logo" | "picture") => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === "logo") {
          setLogoPreview(result)
          setValue("logofile", file)
        } else {
          setPicturePreview(result)
          setValue("picture", file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: Omit<Entity, "id">) => {
    setIsLoading(true)
    try {
      if (entity?.id) {
        await entityService.update(entity.id, data)
        toast({
          title: "Sucesso",
          description: "Entidade atualizada com sucesso",
        })
      } else {
        await entityService.create(data)
        toast({
          title: "Sucesso",
          description: "Entidade criada com sucesso",
        })
        reset()
        setLogoPreview(null)
        setPicturePreview(null)
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar entidade",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entity ? "Editar Entidade" : "Criar Entidade"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="officialname">Nome Oficial</Label>
              <Input
                id="officialname"
                {...register("officialname", { required: "Nome oficial é obrigatório" })}
                placeholder="Nome oficial"
              />
              {errors.officialname && <p className="text-sm text-destructive">{errors.officialname.message}</p>}
            </div>

            <div>
              <Label htmlFor="preferredname">Nome Preferido</Label>
              <Input id="preferredname" {...register("preferredname")} placeholder="Nome preferido" />
            </div>

            <div>
              <Label htmlFor="nuit">NUIT</Label>
              <Input id="nuit" {...register("nuit", { required: "NUIT é obrigatório" })} placeholder="Número do NUIT" />
              {errors.nuit && <p className="text-sm text-destructive">{errors.nuit.message}</p>}
            </div>

            <div>
              <Label htmlFor="ssnumber">Número SS</Label>
              <Input
                id="ssnumber"
                {...register("ssnumber", { required: "Número SS é obrigatório" })}
                placeholder="Número SS"
              />
              {errors.ssnumber && <p className="text-sm text-destructive">{errors.ssnumber.message}</p>}
            </div>

            <div>
              <Label htmlFor="registrationnumber">Número de Registro</Label>
              <Input
                id="registrationnumber"
                {...register("registrationnumber", { required: "Número de registro é obrigatório" })}
                placeholder="Número de registro"
              />
              {errors.registrationnumber && (
                <p className="text-sm text-destructive">{errors.registrationnumber.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="registrationdate">Data de Registro</Label>
              <Input
                id="registrationdate"
                type="date"
                {...register("registrationdate", { required: "Data de registro é obrigatória" })}
              />
              {errors.registrationdate && <p className="text-sm text-destructive">{errors.registrationdate.message}</p>}
            </div>

            <div>
              <Label htmlFor="activitystartdate">Data de Início de Atividade</Label>
              <Input id="activitystartdate" type="date" {...register("activitystartdate")} />
            </div>

            <div>
              <Label htmlFor="entitytypeid">Tipo de Entidade</Label>
              <Select onValueChange={(value) => setValue("entitytypeid", Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo de entidade" />
                </SelectTrigger>
                <SelectContent>
                  {entityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="activitytypeid">Tipo de Atividade</Label>
              <Select onValueChange={(value) => setValue("activitytypeid", Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo de atividade" />
                </SelectTrigger>
                <SelectContent>
                  {activityTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="entitystatusid">Status da Entidade</Label>
              <Select onValueChange={(value) => setValue("entitystatusid", Number.parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar status da entidade" />
                </SelectTrigger>
                <SelectContent>
                  {entityStatuses.map((status) => (
                    <SelectItem key={status.id} value={status.id.toString()}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input id="website" type="url" {...register("website")} placeholder="https://exemplo.com" />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} placeholder="contato@exemplo.com" />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" {...register("phone")} placeholder="Número de telefone" />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="logofile">Arquivo de Logo</Label>
              <Input
                id="logofile"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "logo")}
                className="cursor-pointer"
              />
              {logoPreview && (
                <div className="mt-2">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Visualização do logo"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="picture">Arquivo de Imagem</Label>
              <Input
                id="picture"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "picture")}
                className="cursor-pointer"
              />
              {picturePreview && (
                <div className="mt-2">
                  <img
                    src={picturePreview || "/placeholder.svg"}
                    alt="Visualização da imagem"
                    className="w-20 h-20 object-cover rounded-md border"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isdeleted"
              checked={watch("isdeleted")}
              onCheckedChange={(checked) => setValue("isdeleted", !!checked)}
            />
            <Label htmlFor="isdeleted">Excluído</Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Salvando..." : entity ? "Atualizar" : "Criar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}