import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bar, bb, pie} from 'billboard.js'
import {fetchEmotions} from '../store/emotion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import {PieChart} from '@material-ui/icons'

class Results extends Component {
  constructor() {
    super()
    this.createCharts = this.createCharts.bind(this)
  }
  async componentDidMount() {
    await this.props.getEmotions()
    this.createCharts()
  }

  createCharts() {
    const emotions = this.props.emotion
    const recentResult = emotions[emotions.length - 1]
    // const maxDomain = (Math.max(Object.values(emotions)) * 100).toFixed(2)
    const data = [
      {name: 'Angry', Percentage: (recentResult.angry * 100).toFixed(2)},
      {
        name: 'Disgusted',
        Percentage: (recentResult.disgusted * 100).toFixed(2)
      },
      {name: 'Fearful', Percentage: (recentResult.fearful * 100).toFixed(2)},
      {name: 'Happy', Percentage: (recentResult.happy * 100).toFixed(2)},
      {name: 'Neutral', Percentage: (recentResult.neutral * 100).toFixed(2)},
      {name: 'Sad', Percentage: (recentResult.sad * 100).toFixed(2)},
      {name: 'Surprised', Percentage: (recentResult.surprised * 100).toFixed(2)}
    ]
    return (
      <div>
        {/* <BarChart
        width={600}
        height={600}
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Percentage" fill="#8884d8"/>
      </BarChart> */}
        <RadarChart
          cx={300}
          cy={250}
          outerRadius={150}
          width={500}
          height={500}
          data={data}
        >
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis angle={30} domain={[0, 100]} />
          <Radar
            name="Results"
            dataKey="Percentage"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </div>
    )
    // console.log('these are the emotions--->', this)

    // console.log('these are the recent results ---->', recentResult)
    // const data = [

    // ]
    // bb.generate({
    //   data: {
    //     columns: [
    //       ['Angry', recentResult.angry],
    //       ['Disgusted', recentResult.disgusted],
    //       ['Fearful', recentResult.fearful],
    //       ['Happy', recentResult.happy],
    //       ['Neutral', recentResult.neutral],
    //       ['Sad', recentResult.sad],
    //       ['Surprised', recentResult.surprised]
    //     ],
    //     type: pie(),
    //     label: {
    //       show: true
    //     },
    //     labels: {
    //       colors: 'black'
    //     },
    //     colors: {
    //       Angry: '#060760',
    //       Disgusted: '#090C9B',
    //       Fearful: '#3D52D5',
    //       Happy: '#6878DE',
    //       Neutral: '#B4C5E4',
    //       Sad: '#D2DCEF',
    //       Surprised: '#FBFFF1'
    //     }
    //   },
    //   size: {
    //     height: 500
    //   },
    //   padding: {
    //     left: 250,
    //     right: 250
    //   },
    //   bindto: '#pieChart'
    // })
    // bb.generate({
    //   data: {
    //     columns: [
    //       ['Angry', (recentResult.angry * 100).toFixed(2)],
    //       ['Disgusted', (recentResult.disgusted * 100).toFixed(2)],
    //       ['Fearful', (recentResult.fearful * 100).toFixed(2)],
    //       ['Happy', (recentResult.happy * 100).toFixed(2)],
    //       ['Neutral', (recentResult.neutral * 100).toFixed(2)],
    //       ['Sad', (recentResult.sad * 100).toFixed(2)],
    //       ['Surprised', (recentResult.surprised * 100).toFixed(2)]
    //     ],
    //     type: bar(),
    //     labels: true,
    //     colors: {
    //       Angry: '#060760',
    //       Disgusted: '#090C9B',
    //       Fearful: '#3D52D5',
    //       Happy: '#6878DE',
    //       Neutral: '#B4C5E4',
    //       Sad: '#D2DCEF',
    //       Surprised: '#FBFFF1'
    //     }
    //   },
    //   size: {
    //     height: 500
    //   },
    //   padding: {
    //     left: 250,
    //     right: 250
    //   },
    //   bindto: '#barChart'
    // })
  }

  render() {
    console.log('these are the props ----> ', this)
    return (
      <div>
        {this.props.emotion.length > 0 ? (
          <React.Fragment>
            <h2>Your Pitch Video Results:</h2>
            <div className="results-charts">{this.createCharts()}</div>
          </React.Fragment>
        ) : (
          // <PieChart data={data}/>
          <h4>none</h4>
        )}
      </div>
    )
  }
}

const mapState = state => {
  return {
    emotion: state.emotion
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getEmotions: () => dispatch(fetchEmotions())
  }
}

export default connect(mapState, mapDispatchToProps)(Results)
