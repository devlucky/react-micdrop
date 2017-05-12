import * as React from 'react';
import {Component} from 'react';
import {BarsCanvas} from './styled';

export interface Dimensions {
  width: number;
  height: number;
}

export interface AudioBarsProps {
  audioEl: HTMLAudioElement;
  dimensions?: Dimensions;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  private animationId: number;

  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private gainNode: GainNode;
  private source: MediaElementAudioSourceNode;
  private dataArray: Uint8Array;
  private audioCtxClosingPromise: Promise<void>;

  constructor(props: AudioBarsProps) {
    super(props);
    this.audioCtxClosingPromise = Promise.resolve();
  }

  componentDidMount() {
    const {audioEl} = this.props;

    this.analyse();

    audioEl.addEventListener('playing', this.onPlaying);
    audioEl.addEventListener('pause', this.onPause);
    audioEl.addEventListener('ended', this.onEnded);
  }

  componentWillUnmount() {
    this.stopAnimation();
    this.closeAnalyser();
  }

  render() {
    return (
      <BarsCanvas 
        width={this.width}
        height={this.height}
        innerRef={this.onCanvasElMountOrUnmount}
      />
    );
  }

  private onCanvasElMountOrUnmount = (ref: HTMLCanvasElement): void => {
    if (!ref) {
      return;
    }

    this.canvasEl = ref;
  }

  private draw = (): void => {
    const context = this.canvasEl.getContext('2d');

    if (!context) {
      return;
    }

    this.canvasContext = context;

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.canvasContext.clearRect(0, 0, this.width, this.height);
    this.drawBars();
  }

  private analyse = (): void => {
    const {audioEl} = this.props;

    // required to get around compiler complaining about non-existance of window.webkitAudioContext
    const localWindow = window as any;
    this.audioCtx = new (localWindow.AudioContext || localWindow.webkitAudioContext)();

    this.source = this.audioCtx.createMediaElementSource(audioEl);

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.2;

    this.source.connect(this.analyser);
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);
  }

  private drawBars = (): void => {
    const {canvasContext, width, height, dataArray} = this;
    const bufferLength = dataArray.length;
    const maxBars = 30; 
    const barHeightCorrection = 1.2;
    this.analyser.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = '#EBECF0'; 
    canvasContext.fillRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 4;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      if (i >= maxBars) {
        break;
      }

      const barHeight = dataArray[i];
      const red = 87 + (barHeight * 1);

      canvasContext.fillStyle = `rgba(${red}, 175, 229, 1)`; // TODO: Play with alpha channel based on height?
      canvasContext.fillRect(x, height - barHeight * barHeightCorrection, barWidth, barHeight * barHeightCorrection);

      x += barWidth + 1;
    }

    this.animationId = requestAnimationFrame(this.drawBars);
  }

  private stopAnimation = () => {
    window.cancelAnimationFrame(this.animationId);
  }

  private closeAnalyser = () => {
    this.analyser.disconnect();
    this.source.disconnect();

    this.audioCtxClosingPromise.then(() => {
      this.audioCtxClosingPromise = this.audioCtx.close();
    });
  }

  private onPlaying = () => {
    this.draw();
  }

  private onPause = () => {
    this.stopAnimation();
  }

  private onEnded = () => {
    this.stopAnimation();
  }

  private get width(): number {
    const defaultWidth = 400;
    const {dimensions} = this.props;


    if (!dimensions || !dimensions.width) {
      return defaultWidth;
    }

    return dimensions.width;
  }

  private get height(): number {
    const defaultHeight = 400;
    const {dimensions} = this.props;


    if (!dimensions || !dimensions.height) {
      return defaultHeight;
    }

    return dimensions.height;
  }
}
