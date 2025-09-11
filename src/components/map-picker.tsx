"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Search } from "lucide-react"

interface MapPickerProps {
  latitude?: string
  longitude?: string
  onLocationChange: (lat: string, lng: string) => void
  className?: string
}

export function MapPicker({ latitude, longitude, onLocationChange, className }: MapPickerProps) {
  const [currentLat, setCurrentLat] = useState(latitude || "")
  const [currentLng, setCurrentLng] = useState(longitude || "")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)

  // Implementação demo do mapa
  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    // Converter coordenadas de pixels para lat/lng demo (apenas para demonstração)
    const lat = (90 - (y / rect.height) * 180).toFixed(6)
    const lng = ((x / rect.width) * 360 - 180).toFixed(6)

    setCurrentLat(lat)
    setCurrentLng(lng)
    onLocationChange(lat, lng)
  }

  const handleGetCurrentLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toString()
          const lng = position.coords.longitude.toString()
          setCurrentLat(lat)
          setCurrentLng(lng)
          onLocationChange(lat, lng)
          setIsLoading(false)
        },
        (error) => {
          console.error("Erro ao obter localização:", error)
          setIsLoading(false)
        },
      )
    } else {
      setIsLoading(false)
    }
  }

  const handleManualInput = () => {
    onLocationChange(currentLat, currentLng)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="manual-lat">Latitude</Label>
            <Input
              id="manual-lat"
              value={currentLat}
              onChange={(e) => setCurrentLat(e.target.value)}
              placeholder="Digite a latitude"
            />
          </div>
          <div>
            <Label htmlFor="manual-lng">Longitude</Label>
            <Input
              id="manual-lng"
              value={currentLng}
              onChange={(e) => setCurrentLng(e.target.value)}
              placeholder="Digite a longitude"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleManualInput} variant="outline" size="sm">
            Usar Coordenadas Manuais
          </Button>
          <Button onClick={handleGetCurrentLocation} disabled={isLoading} size="sm">
            {isLoading ? "Obtendo Localização..." : "Usar Localização Atual"}
          </Button>
        </div>

        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Pesquisar uma localização..."
            className="flex-1"
          />
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        <div
          ref={mapRef}
          onClick={handleMapClick}
          className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 border-2 border-dashed border-gray-300 rounded-lg cursor-crosshair relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Clique em qualquer lugar para definir a localização</p>
              <p className="text-xs text-gray-400 mt-1">
                Este é um mapa de demonstração. Em produção, usa- se Google Maps ou similar.
              </p>
            </div>
          </div>

          {currentLat && currentLng && (
            <div
              className="absolute w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((Number.parseFloat(currentLng) + 180) / 360) * 100}%`,
                top: `${((90 - Number.parseFloat(currentLat)) / 180) * 100}%`,
              }}
            >
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>

        {currentLat && currentLng && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Localização Selecionada:</strong> {currentLat}, {currentLng}
          </div>
        )}
      </CardContent>
    </Card>
  )
}