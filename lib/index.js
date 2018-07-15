"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var context = new (window.AudioContext || window.webkitAudioContext)();

context.destination.nodeIndex = 0;

if (context.state !== "running") {
  var resumeHandler = function resumeHandler() {
    context.resume();
    document.removeEventListener("click", resumeHandler);
  };

  document.addEventListener("click", resumeHandler);
}

var nodes = [context.destination];

var createNode = function createNode(node) {
  var connect = node.connect.bind(node);
  var disconnect = node.disconnect.bind(node);

  node.outputIndice = [];

  node.connect = function (destination, outputIndex, inputIndex) {
    connect(destination, outputIndex, inputIndex);
    node.outputIndice.push(destination.nodeIndex);

    return destination;
  };

  node.disconnect = function (destination, output, input) {
    disconnect(destination, output, input);

    var index = node.outputIndice.indexOf(destination.nodeIndex);

    if (index !== -1) {
      node.outputIndice.splice(index, 1);
    }
  };

  node.nodeIndex = nodes.push(node) - 1;

  return node;
};

var isReady = exports.isReady = function isReady() {
  return context.state === "running";
};

var destination = exports.destination = context.destination;

var createMediaSource = exports.createMediaSource = function createMediaSource(url) {
  return new Promise(function (resolve, reject) {
    var element = document.createElement("audio");
    var source = null;

    element.addEventListener("canplaythrough", function () {
      if (source === null) {
        source = context.createMediaElementSource(element);

        source.element = element;

        source.start = function () {
          element.currentTime = 0;
          element.play();
        };

        source.pause = function () {
          element.pause();
        };

        source.resume = function () {
          element.play();
        };

        source.stop = function () {
          element.pause();
          element.currentTime = 0;
        };
      }

      resolve(createNode(source));
    });

    element.addEventListener("error", function () {
      reject("error loading media source: '" + url + "'");
    });

    var extension = url.substring(url.lastIndexOf(".") + 1, url.length);

    var sourceElement = document.createElement("source");
    sourceElement.src = url;
    sourceElement.type = "audio/" + extension;

    element.appendChild(sourceElement);
  });
};

var createBufferSource = exports.createBufferSource = function createBufferSource(url) {
  return new Promise(function (resolve, reject) {
    var request = new XMLHttpRequest();

    request.addEventListener("load", function () {
      context.decodeAudioData(request.response, function (buffer) {
        var source = context.createBufferSource();
        source.buffer = buffer;
        resolve(createNode(source));
      }, reject);
    });
    request.addEventListener("error", function () {
      reject("error loading buffer source: '" + url + "'");
    });

    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.send();
  });
};

var createLiveSource = exports.createLiveSource = function createLiveSource() {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    return createNode(context.createMediaStreamSource(stream));
  });
};

var createGain = exports.createGain = function createGain() {
  return createNode(context.createGain());
};

var createAnalyser = exports.createAnalyser = function createAnalyser() {
  return createNode(context.createAnalyser());
};

var createOscillator = exports.createOscillator = function createOscillator() {
  return createNode(context.createOscillator());
};

/** Returns an array of frequency data from the analyser. */
var getFrequencyData = exports.getFrequencyData = function getFrequencyData(analyser) {
  var frequencyData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(frequencyData);

  return frequencyData;
};

exports.default = Audio;