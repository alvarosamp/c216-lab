import { money } from '../format'

export default function EquityChart({ curve }) {
  if (!curve || curve.length < 2) return null
  const values = curve.map((point) => Number(point.value))
  const min = Math.min(...values, 0)
  const max = Math.max(...values, 1)
  const range = max - min || 1
  const coordinates = values.map(
    (value, index) =>
      `${(index / (values.length - 1)) * 700},${175 - ((value - min) / range) * 150}`,
  )
  return (
    <div className="chart">
      <div className="chart-heading">
        <span>Evolução do patrimônio</span>
        <strong>{money(values.at(-1))}</strong>
      </div>
      <svg
        viewBox="0 0 700 190"
        preserveAspectRatio="none"
        role="img"
        aria-label="Gráfico de evolução do patrimônio"
      >
        <defs>
          <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#bcf582" stopOpacity=".3" />
            <stop offset="1" stopColor="#bcf582" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M ${coordinates.join(' L ')} L 700,190 L 0,190 Z`}
          fill="url(#fill)"
        />
        <polyline
          points={coordinates.join(' ')}
          fill="none"
          stroke="#b8f37c"
          strokeWidth="3"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="chart-dates">
        <span>{curve[0].date}</span>
        <span>{curve.at(-1).date}</span>
      </div>
    </div>
  )
}
