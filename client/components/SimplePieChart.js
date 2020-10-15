import {PieChart, Pie, Sector, Cell} from 'recharts'
import React, {Component} from 'react'
const COLORS = [
  '#060760',
  '#090C9B',
  '#3D52D5',
  '#6878DE',
  '#B4C5E4',
  '#D2DCEF',
  '#9CAFE8'
  // '#FBFFF1'
]
const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default class SimplePieChart extends Component {
  render() {
    console.log('our data', this.props.data)
    return (
      <PieChart width={200} height={300} onMouseEnter={this.onPieEnter}>
        <Pie
          data={this.props.data}
          cx={100}
          cy={150}
          labelLine={false}
          outerRadius={95}
          fill="#8884d8"
          dataKey="value"
        >
          {this.props.data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    )
  }
}
