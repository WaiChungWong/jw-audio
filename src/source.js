import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "rc-slider";

import Play from "./resources/play.png";
import Pause from "./resources/pause.png";
import Stop from "./resources/stop.png";
import Repeat from "./resources/repeat.png";
import Shuffle from "./resources/shuffle.png";

import "./source.css";

class Source extends Component {
  constructor(props) {
    super(props);

    this.state = {
      time: 0,
      playing: false,
      duration: props.node.element.duration,
      repeat: props.node.element.loop
    };

    this._timeUpdate = this._timeUpdate.bind(this);
    this._togglePlay = this._togglePlay.bind(this);
    this._stop = this._stop.bind(this);
    this._setCurrentTime = this._setCurrentTime.bind(this);
    this._toggleRepeat = this._toggleRepeat.bind(this);
  }

  _timeUpdate() {
    const { node } = this.props;

    this.setState({ time: node.element.currentTime });
  }

  _togglePlay() {
    const { node } = this.props;
    const { playing } = this.state;

    if (playing) {
      node.pause();
    } else {
      node.resume();
    }

    this.setState({ playing: !playing });
  }

  _stop() {
    const { node } = this.props;

    node.stop();
    this.setState({ playing: false });
  }

  _setCurrentTime(time) {
    const { node } = this.props;
    const { duration } = this.state;

    node.element.currentTime = (time * duration) / 100;
    this.setState({ time: node.element.currentTime });
  }

  _toggleRepeat(repeat) {
    const { node } = this.props;

    node.element.loop = repeat;
    this.setState({ repeat: node.element.loop });
  }

  componentDidMount() {
    const { node } = this.props;

    node.element.addEventListener("timeupdate", this._timeUpdate);
    node.element.addEventListener("ended", this._stop);
  }

  componentWillUnmount() {
    const { node } = this.props;

    node.element.removeEventListener("timeupdate", this._timeUpdate);
    node.element.addEventListener("ended", this._stop);
  }

  render() {
    const { time, duration, playing, repeat } = this.state;

    return (
      <div className="node source-node">
        <div className="time-bar">
          <div className="time">
            {`${Math.floor(time / 60)}:${
              time < 10 ? `0${Math.floor(time)}` : Math.floor(time)
            } `}/{` ${Math.floor(duration / 60)}:${
              duration < 10 ? `0${Math.floor(duration)}` : Math.floor(duration)
            }`}
          </div>
          <Slider
            value={(time / duration) * 100}
            onChange={this._setCurrentTime}
          />
        </div>
        <div className="buttons">
          <img
            src={playing ? Pause : Play}
            alt="Toggle play"
            onClick={this._togglePlay}
          />
          <img src={Stop} alt="Stop" onClick={this._stop} />
          <img
            src={repeat ? Shuffle : Repeat}
            alt="Toggle repeat"
            onClick={this._toggleRepeat}
          />
        </div>
      </div>
    );
  }
}

Source.propTypes = {
  node: PropTypes.shape()
};

export default Source;
