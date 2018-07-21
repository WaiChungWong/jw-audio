const context = new (window.AudioContext || window.webkitAudioContext)();

context.destination.nodeIndex = 0;

if (context.state !== "running") {
  let resumeHandler = () => {
    context.resume();
    document.removeEventListener("click", resumeHandler);
  };

  document.addEventListener("click", resumeHandler);
}

const nodes = [context.destination];

const createNode = node => {
  let connect = node.connect.bind(node);
  let disconnect = node.disconnect.bind(node);

  node.outputIndice = [];

  node.connect = (destination, outputIndex, inputIndex) => {
    connect(
      destination,
      outputIndex,
      inputIndex
    );
    node.outputIndice.push(destination.nodeIndex);

    return destination;
  };

  node.disconnect = (destination, output, input) => {
    disconnect(destination, output, input);

    let index = node.outputIndice.indexOf(destination.nodeIndex);

    if (index !== -1) {
      node.outputIndice.splice(index, 1);
    }
  };

  node.nodeIndex = nodes.push(node) - 1;

  return node;
};

export const isReady = () => context.state === "running";

export const destination = context.destination;

export const createMediaSource = (url, timeout) => {
  return new Promise((resolve, reject) => {
    let element = document.createElement("audio");
    let source = null;
    let timer;

    if (timeout) {
      timer = setTimeout(() => {
        if (element.readyState > 3) {
          onSourceReady();
        } else {
          reject(`loading media source timed out: '${url}'`);
        }
      }, timeout);
    }

    let onSourceReady = () => {
      clearTimeout(timer);

      if (source === null) {
        source = context.createMediaElementSource(element);

        source.element = element;

        source.start = () => {
          element.currentTime = 0;
          element.play();
        };

        source.pause = () => {
          element.pause();
        };

        source.resume = () => {
          element.play();
        };

        source.stop = () => {
          element.pause();
          element.currentTime = 0;
        };
      }

      resolve(createNode(source));
    };

    element.addEventListener("canplaythrough", onSourceReady);

    element.addEventListener("error", () => {
      reject(`error loading media source: '${url}'`);
    });

    let extension = url.substring(url.lastIndexOf(".") + 1, url.length);

    let sourceElement = document.createElement("source");
    sourceElement.src = url;
    sourceElement.type = "audio/" + extension;

    element.appendChild(sourceElement);

    if (element.readyState > 3) {
      onSourceReady();
    }
  });
};

export const createBufferSource = url => {
  return new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();

    request.addEventListener("load", () => {
      context.decodeAudioData(
        request.response,
        buffer => {
          let source = context.createBufferSource();
          source.buffer = buffer;
          resolve(createNode(source));
        },
        reject
      );
    });
    request.addEventListener("error", () => {
      reject(`error loading buffer source: '${url}'`);
    });

    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.send();
  });
};

export const createLiveSource = () => {
  return navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then(stream => createNode(context.createMediaStreamSource(stream)));
};

export const createGain = () => {
  return createNode(context.createGain());
};

export const createAnalyser = () => {
  return createNode(context.createAnalyser());
};

export const createOscillator = () => {
  return createNode(context.createOscillator());
};

/** Returns an array of frequency data from the analyser. */
export const getFrequencyData = analyser => {
  let frequencyData = new Uint8Array(analyser.frequencyBinCount);

  analyser.getByteFrequencyData(frequencyData);

  return frequencyData;
};

export default Audio;
