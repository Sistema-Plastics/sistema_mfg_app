import React, { Component } from "react";

export class Clock extends Component {
  constructor() {
    super();

    this.state = {
      time: new Date(),
    };
  }

  componentDidMount() {
    this.update = setInterval(() => {
      this.setState({
        time: new Date(),
      });
    }, 1 * 1000);
  }

  componentWillUnmount() {
    clearInterval(this.update);
  }

  render() {
    const { time } = this.state;
    const timeOpts = {
      timeZone: "Pacific/Auckland",
      hour12: false,
      hour: "numeric",
      minute: "numeric",
    };
    return (
      <div className="clock">
        <h6 className="clockText">
          {time.toLocaleTimeString("en-US", timeOpts)}
        </h6>
      </div>
    );
  }
}

export default Clock;
