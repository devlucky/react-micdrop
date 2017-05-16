export interface AnalyserSpec {
  audioEl: HTMLAudioElement;
  audioContext: AudioContext;
}

export class Analyser {
  audioEl: HTMLAudioElement;
  analyserNode: AnalyserNode;
  private source: MediaElementAudioSourceNode;

  constructor(spec: AnalyserSpec) {
    this.audioEl = spec.audioEl;
    this.createAnalyserNode(spec);
  }

  closeAudioNodes = () => {
    const {analyserNode, source} = this;
    if (analyserNode) { analyserNode.disconnect(); }
    if (source) { source.disconnect(); }
  }

  private createAnalyserNode = ({audioEl, audioContext}: AnalyserSpec): void => {
    this.source = audioContext.createMediaElementSource(audioEl);

    this.analyserNode = audioContext.createAnalyser();
    const numDataPoints = 512;
    this.analyserNode.fftSize = 2 * numDataPoints;

    this.source.connect(this.analyserNode);
    this.analyserNode.connect(audioContext.destination);
  }
}
