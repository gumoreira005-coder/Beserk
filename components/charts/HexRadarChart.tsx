"use client"

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const DEFAULT_DATA = [
  { attribute: "Foco", value: 75 },
  { attribute: "Disciplina", value: 60 },
  { attribute: "Corpo", value: 50 },
  { attribute: "Resiliência", value: 80 },
  { attribute: "Estratégia", value: 65 },
  { attribute: "Criatividade", value: 70 },
  { attribute: "Propósito", value: 85 },
  { attribute: "Finanças", value: 55 },
  { attribute: "Aprendizado", value: 72 },
  { attribute: "Tempo", value: 60 },
  { attribute: "Conexões", value: 45 },
  { attribute: "Recuperação", value: 68 },
]

interface HexRadarChartProps {
  data?: typeof DEFAULT_DATA
}

export function HexRadarChart({ data = DEFAULT_DATA }: HexRadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={340}>
      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
        <PolarGrid
          gridType="polygon"
          stroke="hsl(0 0% 18%)"
          strokeWidth={1}
        />
        <PolarAngleAxis
          dataKey="attribute"
          tick={{
            fill: "hsl(30 10% 50%)",
            fontSize: 10,
            fontFamily: "var(--font-cinzel), serif",
          }}
        />
        <Radar
          name="Atributos"
          dataKey="value"
          stroke="hsl(0 68% 32%)"
          fill="hsl(0 68% 32%)"
          fillOpacity={0.2}
          strokeWidth={2}
          dot={{ fill: "hsl(42 58% 55%)", r: 3, strokeWidth: 0 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(0 0% 8%)",
            border: "1px solid hsl(0 0% 18%)",
            borderRadius: "6px",
            color: "hsl(30 15% 88%)",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`${value}/100`, "Valor"]}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
