import * as React from 'react';
import {Component} from 'react';
import {BarsCanvas} from './styled';

export interface Dimensions {
  width: number;
  height: number;
}

export interface AudioBarsProps {
  audioEl: HTMLAudioElement;
  audioContext: AudioContext;
  dimensions?: Dimensions;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  private animationId: number;

  private source: MediaElementAudioSourceNode;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;

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

  private analyse = (): void => {
    const {audioContext, audioEl} = this.props;

    this.source = audioContext.createMediaElementSource(audioEl);

    const maxNumBars = 128;
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 2 * maxNumBars;

    this.source.connect(this.analyser);
    this.analyser.connect(audioContext.destination);
  }

  private onPlaying = () => {
    this.draw();
  }

  private draw = (): void => {
    const context = this.canvasEl.getContext('2d');

    if (!context) {
      return;
    }

    this.canvasContext = context;

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.drawBars();
  }

  private drawBars = (): void => {
    const {canvasContext, width: canvasWidth, height: canvasHeight, dataArray} = this;

    // clear the canvas
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    // TODO allow user to specify a max number of bars
    const numBarsToDraw = dataArray.length;
    this.analyser.getByteFrequencyData(dataArray);

    const barWidth = canvasWidth / numBarsToDraw;

    // draw the bars
    for (let i = 0; i < numBarsToDraw; i++) {
      const x = i * barWidth + i;

      const percentBarHeight = dataArray[i] / this.analyser.fftSize;
      const barHeight = canvasHeight * percentBarHeight;

      const red = Math.round(87 + (169 * percentBarHeight));
      canvasContext.fillStyle = `rgba(${red}, 175, 229, 1)`; // TODO: Play with alpha channel based on height?

      canvasContext.fillRect(x, canvasHeight - barHeight, barWidth, barHeight);
    }

    this.animationId = requestAnimationFrame(this.drawBars);
  }

  private onPause = () => {
    this.stopAnimation();
  }

  private onEnded = () => {
    this.stopAnimation();
  }

  private stopAnimation = () => {
    cancelAnimationFrame(this.animationId);
  }

  private closeAnalyser = () => {
    const {analyser, source} = this;
    if (analyser) { analyser.disconnect(); }
    if (source) { source.disconnect(); }
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
