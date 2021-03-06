/**
 * Component: MemoryStackChart
 * Purpose: Displays MemoryStackChart of stacked data
 * Properties:
 *  url : local url prefix
 *  agentId : Agent Id in database
 *  stackType: Graph's stack type
 **/

//React and React Bootstrap imports
import React, { Component } from "react";
//HTTP Promise library import
import { get } from "axios";
//D3.js import
import { scaleTime } from "d3-scale";
import { timeHour } from "d3-time";
//Moment.js import
import moment from "moment";

//Recharts component imports
import {
  AreaChart,
  Area,
  Axis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

class MemoryStackChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  //Runs after Component is Loaded
  componentDidMount() {
    var _this = this;
    get(this.props.url + this.props.agentId + "/" + this.props.stackType)
      .then(function(response) {
        var data = response.data;
        //Times each time by 100 to prep for conversion
        data.forEach(function(d) {
          d.timestamp = d.timestamp * 1000;
        });
        //Sets data in component
        _this.setState({
          data: response.data
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  //Generates graph ticks for X Axis
  getTicks(data) {
    if (!data || !data.length) {
      return [];
    }
    const domain = [
      new Date(data[0].timestamp),
      new Date(data[data.length - 1].timestamp)
    ];
    const scale = scaleTime().domain(domain);
    const ticks = scale.ticks(timeHour, 1);
    return ticks.map(entry => +entry);
  }

  //Formats unix times to hours and minutes
  dateFormat(time) {
    return moment(time).format("HH:mm");
  }

  //Formats unix times to local Month/Day/Hour/Minutes format
  toolTipDateFormat(time) {
    return moment(time).format("lll");
  }

  render() {
    return (
      <ResponsiveContainer width="100%" height="35%" minHeight={300}>
        <AreaChart
          width={600}
          height={150}
          data={this.state.data}
          margin={{ top: 10, right: 0, left: 0, bottom: 30 }}
        >
          <XAxis
            dataKey="timestamp"
            ticks={this.getTicks(this.state.data)}
            tickFormatter={this.dateFormat}
          />
          <YAxis />
          <CartesianGrid strokeDasharray="1 1" />
          <Tooltip labelFormatter={this.toolTipDateFormat} />
          <Area
            type="basisOpen"
            dataKey="memory_cached"
            stroke="#003552"
            fill="#003552"
          />
          <Area
            type="basisOpen"
            dataKey="memory_available"
            stroke="#003552"
            fill="#003552"
          />
          <Area
            type="basisOpen"
            dataKey="memory_free"
            stroke="#60fc94"
            fill="#60fc94"
          />
          <Area
            type="basisOpen"
            dataKey="memory_shared"
            stroke="#1dd18c"
            fill="#1dd18c"
          />
          <Area
            type="basisOpen"
            dataKey="memory_buffers"
            stroke="#008c7e"
            fill="#008c7e"
          />

        </AreaChart>
      </ResponsiveContainer>
    );
  }
}

//Default properties
MemoryStackChart.defaultProps = {
  url: "/charts/stacked/",
  agentId: "2",
  stackType: "memory"
};

//Exports class to Global namespace
export default MemoryStackChart;
