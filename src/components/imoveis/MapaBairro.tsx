"use client";

import { useEffect, useState } from "react";

interface Props {
  bairro: string;
  cidade: string;
}

export default function MapaBairro({ bairro, cidade }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function geocode() {
      try {
        const query = `${bairro}, ${cidade}, SP, Brasil`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
          { headers: { "User-Agent": "ImoveisPeruibe/1.0" } }
        );
        const data = await res.json();
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
        } else {
          // Fallback: buscar só a cidade
          const res2 = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${cidade}, SP, Brasil`)}&limit=1`,
            { headers: { "User-Agent": "ImoveisPeruibe/1.0" } }
          );
          const data2 = await res2.json();
          if (data2 && data2.length > 0) {
            setCoords({ lat: parseFloat(data2[0].lat), lon: parseFloat(data2[0].lon) });
          }
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    geocode();
  }, [bairro, cidade]);

  if (loading) {
    return (
      <div className="w-full h-[300px] bg-cinza-claro rounded-xl flex items-center justify-center">
        <p className="text-sm text-cinza-medio">Carregando mapa...</p>
      </div>
    );
  }

  if (!coords) {
    return (
      <div className="w-full h-[200px] bg-cinza-claro rounded-xl flex flex-col items-center justify-center gap-2">
        <p className="text-sm text-cinza-medio">📍 {bairro}, {cidade}</p>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(`${bairro}, ${cidade}, SP, Brasil`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-laranja hover:underline"
        >
          Ver no Google Maps →
        </a>
      </div>
    );
  }

  // Calcula bounding box (~1.5km ao redor)
  const delta = 0.015;
  const bbox = `${coords.lon - delta},${coords.lat - delta},${coords.lon + delta},${coords.lat + delta}`;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lon}`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        title={`Mapa do bairro ${bairro} em ${cidade}`}
      />
    </div>
  );
}
