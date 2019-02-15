import React, { Component } from "react";
import { render } from "react-dom";

import Source from "./source";
import Gain from "./gain";
import Analyser from "./analyser";

import * as Audio from "./module";
import guitar from "./resources/guitar.mp3";
import piano from "./resources/piano.mp3";

import "./style.css";

class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    let destination = Audio.destination;

    try {
      let guitarSource = await Audio.createMediaSource(guitar);
      let guitarAnalyser = Audio.createAnalyser();
      let guitarGain = Audio.createGain();

      guitarSource
        .connect(guitarGain)
        .connect(guitarAnalyser)
        .connect(destination);

      this.setState({
        guitarSource,
        guitarGain,
        guitarAnalyser
      });
    } catch (error) {}

    try {
      let pianoSource = await Audio.createMediaSource(piano);
      let pianoAnalyser = Audio.createAnalyser();
      let pianoGain = Audio.createGain();

      pianoSource
        .connect(pianoGain)
        .connect(pianoAnalyser)
        .connect(destination);

      this.setState({
        pianoSource,
        pianoGain,
        pianoAnalyser
      });
    } catch (error) {}

    try {
      let liveSource = await Audio.createLiveSource();
      let liveAnalyser = Audio.createAnalyser();
      let liveGain = Audio.createGain();

      liveSource
        .connect(liveGain)
        .connect(liveAnalyser)
        .connect(destination);

      this.setState({
        liveSource,
        liveGain,
        liveAnalyser
      });
    } catch (error) {}
  }

  componentWillUnmount() {}

  render() {
    const {
      guitarSource,
      guitarGain,
      guitarAnalyser,
      pianoSource,
      pianoGain,
      pianoAnalyser,
      liveSource,
      liveGain,
      liveAnalyser
    } = this.state;

    return (
      <div ref={d => (this.demo = d)} id="demo">
        {guitarSource && guitarGain && guitarAnalyser && (
          <div className="channel">
            <hr />
            <Source node={guitarSource} />
            <Gain node={guitarGain} />
            <Analyser node={guitarAnalyser} />
          </div>
        )}
        {pianoSource && pianoGain && pianoAnalyser && (
          <div className="channel">
            <hr />
            <Source node={pianoSource} />
            <Gain node={pianoGain} />
            <Analyser node={pianoAnalyser} />
          </div>
        )}
        {liveSource && liveGain && liveAnalyser && (
          <div className="channel">
            <hr />
            <div className="node">Live </div>
            <Gain node={liveGain} />
            <Analyser node={liveAnalyser} />
          </div>
        )}
      </div>
    );
  }
}

render(<Demo />, document.getElementById("root"));
