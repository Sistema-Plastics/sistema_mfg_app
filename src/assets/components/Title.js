import React, { Component } from "react";
// import { Helmet } from "react-helmet";

export class Title extends Component {
  render() {
    const { title } = this.props;
    return (
    
        <title>{title}</title>
     
    );
  }
}

export default Title;
