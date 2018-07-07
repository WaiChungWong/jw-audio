import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";

import "./gain.css";

class Gain extends Component {
  constructor(props) {
    super(props);

    this.state = { value: props.node.gain.value };

    this._setGainValue = this._setGainValue.bind(this);
  }

  _setGainValue(value) {
    const { node } = this.props;

    node.gain.value = value / 100;
    this.setState({ value: node.gain.value });
  }

  render() {
    const { value } = this.state;

    return (
      <div className="node gain-node">
        <Slider value={value * 100} onChange={this._setGainValue} />
      </div>
    );
  }
}

Gain.propTypes = {
  node: PropTypes.shape()
};

export default Gain;
