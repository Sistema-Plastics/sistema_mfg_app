import React, { Component } from "react";
import { Helmet } from "react-helmet";

export class Title extends Component {
  render() {
    const { title } = this.props;
    return (
      <Helmet>
        <title>{title}</title>
      </Helmet>
    );
  }
}

export default Title;
