# jw-audio

A class which controls and manages the audio context.

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/jw-audio.svg
[npm-url]: http://npmjs.org/package/jw-audio
[travis-image]: https://img.shields.io/travis/WaiChungWong/jw-audio.svg
[travis-url]: https://travis-ci.org/WaiChungWong/jw-audio
[node-image]: https://img.shields.io/badge/node.js-%3E=_0.10-green.svg
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/jw-audio.svg
[download-url]: https://npmjs.org/package/jw-audio

[Demo](http://waichungwong.github.io/jw-audio/build)

## Install

[![NPM](https://nodei.co/npm/jw-audio.png)](https://nodei.co/npm/jw-audio)

## Props

| Prop          | Description                                |
| ------------- | ------------------------------------------ |
| `destination` | the destination node of the audio context. |

## Methods

| Method               | Parameters                | Description                                                                                                                                       |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createMediaSource`  | `url`: string             | creates a media element source from a given url. The returned source node allows playback controls such as play, pause, set playback time, etc... |
| `createBufferSource` | `url`: string             | creates a buffer source from a given url.                                                                                                         |
| `createLiveSource`   |                           | creates a live stream source by requesting user audio media.                                                                                      |
| `createGain`         |                           | creates a gain node.                                                                                                                              |
| `createAnalyser`     |                           | creates an analyser node.                                                                                                                         |
| `createOscillator`   |                           | creates an oscillator node.                                                                                                                       |
| `getFrequencyData`   | `analyser`: analyser node | generates an array of frequency data from a given analyser node.                                                                                  |

## Usage

```javascript
import * as Audio from "jw-audio";

/** Retrieves the destination node from the audio context. */
let destination = Audio.destination;

/** Creates a media source from a url. */
let source = await Audio.createMediaSource("<url>");

/** Create an analyser node from the audio context. */
let analyser = Audio.createAnalyser();

/** Create an gain node from the audio context. */
let gain = Audio.createGain();

/** Create an live stream source node from the audio context. */
let liveSource = await Audio.createLiveSource();

/** Generates an array of frequency data from a given analyser node. */
let frequencyData = Audio.getFrequencyData(analyser);
```
