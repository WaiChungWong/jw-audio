import React, { Component } from "react";
import PropTypes from "prop-types";
import AnimateCanvas from "jw-animate-canvas";

import { getFrequencyData } from "./module";

import "./analyser.css";

class Analyser extends Component {
  componentDidMount() {
    this.canvas.animator.start();
  }

  draw() {
    const { canvas, props } = this;
    const { node } = props;
    const context = canvas.getContext();
    const element = canvas.getCanvasElement();
    const { width, height } = element;

    let frequencyData = getFrequencyData(node);

    let frequencyCount = frequencyData.length;

    let barWidth = width / frequencyCount;
    let barHeight = height / 255;

    context.clearRect(0, 0, width, height);

    for (let i = 0; i < frequencyCount; i++) {
      context.fillRect(
        i * barWidth,
        (255 - frequencyData[i]) * barHeight,
        barWidth,
        frequencyData[i] * barHeight
      );
    }
  }

  render() {
    return (
      <div className="node analyser-node">
        <AnimateCanvas
          ref={c => (this.canvas = c)}
          className="analyser-chart"
          animate={() => this.draw()}
          onResize={() => this.draw()}
        />
      </div>
    );
  }
}

Analyser.propTypes = {
  node: PropTypes.shape()
};

export default Analyser;
