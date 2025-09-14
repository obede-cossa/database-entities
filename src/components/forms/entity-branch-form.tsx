"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPicker } from "@/components/map-picker"
import type { EntityBranch, Entity, Location, EntityStatus } from "@/types/entities"
import { entityBranchService, entityService, locationService, entityStatusService } from "@/lib/services"
import { useToast } from "@/hooks/use-toast"

interface EntityBranchFormProps {
  entityBranch?: EntityBranch
  onSuccess?: () => void
}

export function EntityBranchForm({ entityBranch, onSuccess }: EntityBranchFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [entities, setEntities] = useState<Entity[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [entityStatuses, setEntityStatuses] = useState<EntityStatus[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<Omit<EntityBranch, "id">>({
    defaultValues: entityBranch
      ? { ...entityBranch }
      : {
        entityid: 1,
        is_main: false,
        address: "",
        postcode: "",
        locationid: 1,
        phone: "",
        contactname: "",
        contactphone: "",
        contactemail: "",
        gpslat: "",
        gpslong: "",
        openonholidays: false,
        holidaysopentime: "",
        holidaysclosetime: "",
        entitystatusid: 1,
        is_deleted: false,
        createdon: new Date().toISOString(),
      },
  })

  useEffect(() => {
    loadRelatedData()
  }, [])

  const loadRelatedData = async () => {
    try {
      const [entitiesData, locationsData, entityStatusesData] = await Promise.all([
        entityService.getAll(),
        locationService.getAll(),
        entityStatusService.getAll(),
      ])
      setEntities(Array.isArray(entitiesData) ? entitiesData : [])
      setLocations(Array.isArray(locationsData) ? locationsData : [])
      setEntityStatuses(Array.isArray(entityStatusesData) ? entityStatusesData : [])
    } catch (error) {
      setEntities([])
      setLocations([])
      setEntityStatuses([])
      toast({
        title: "Erro",
        description: "Falha ao carregar dados relacionados",
        variant: "destructive",
      })
    }
  }

  const handleLocationChange = (lat: string, lng: string) => {
    setValue("gpslat", lat)
    setValue("gpslong", lng)
  }

  const onSubmit = async (data: Omit<EntityBranch, "id">) => {
    setIsLoading(true)
    try {
      if (entityBranch?.id) {
        await entityBranchService.update(entityBranch.id, data)
        toast({
          title: "Sucesso",
          description: "Filial atualizada com sucesso",
        })
      } else {
        await entityBranchService.create(data)
        toast({
          title: "Sucesso",
          description: "Filial criada com sucesso",
        })
        reset()
      }
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao salvar filial",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{entityBranch ? "Editar Filial" : "Criar Filial"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="entityid">Entidade</Label>
                <Select onValueChange={(value) => setValue("entityid", Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar entidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id.toString()}>
                        {entity.officialname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locationid">Localização</Label>
                <Select onValueChange={(value) => setValue("locationid", Number.parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar localização" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
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
                <Label htmlFor="postcode">Código Postal</Label>
                <Input id="postcode" {...register("postcode")} placeholder="Código postal" />
              </div>

              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" {...register("phone")} placeholder="Telefone da filial" />
              </div>

              <div>
                <Label htmlFor="contactname">Nome do Contato</Label>
                <Input id="contactname" {...register("contactname")} placeholder="Nome da pessoa de contato" />
              </div>

              <div>
                <Label htmlFor="contactphone">Telefone do Contato</Label>
                <Input id="contactphone" {...register("contactphone")} placeholder="Telefone de contato" />
              </div>

              <div>
                <Label htmlFor="contactemail">Email do Contato</Label>
                <Input id="contactemail" type="email" {...register("contactemail")} placeholder="Email de contato" />
              </div>

              <div>
                <Label htmlFor="holidaysopentime">Horário de Abertura em Feriados</Label>
                <Input id="holidaysopentime" type="time" {...register("holidaysopentime")} />
              </div>

              <div>
                <Label htmlFor="holidaysclosetime">Horário de Encerramento em Feriados</Label>
                <Input id="holidaysclosetime" type="time" {...register("holidaysclosetime")} />
              </div>
            </div>
            <MapPicker latitude={watch("gpslat")} longitude={watch("gpslong")} onLocationChange={handleLocationChange} />

            <div>
              <Label htmlFor="address">Endereço</Label>
              <Textarea id="address" {...register("address")} placeholder="Endereço da sucursal" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="ismain"
                  checked={watch("is_main")}
                  onCheckedChange={(checked) => setValue("is_main", !!checked)}
                />
                <Label htmlFor="ismain">É Sucursal Principal</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openonholidays"
                  checked={watch("openonholidays")}
                  onCheckedChange={(checked) => setValue("openonholidays", !!checked)}
                />
                <Label htmlFor="openonholidays">Abre em Feriados</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isdeleted"
                  checked={watch("is_deleted")}
                  onCheckedChange={(checked) => setValue("is_deleted", !!checked)}
                />
                <Label htmlFor="isdeleted">Excluído</Label>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? "Salvando..." : entityBranch ? "Atualizar" : "Criar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}