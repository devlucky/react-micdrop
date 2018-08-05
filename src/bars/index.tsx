import * as React from 'react';
import {Component} from 'react';

import {Analyser} from '../analyser';
import {Dimensions} from '../utils/dimensions';
import {BarsCanvas} from './styled';

export interface AudioBarsProps {
  analyser: Analyser;
  dimensions?: Dimensions;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl?: HTMLCanvasElement;
  private canvasContext?: CanvasRenderingContext2D;
  private animationId?: number;

  componentDidMount() {
    const {audioEl} = this.props.analyser;

    audioEl.addEventListener('playing', this.onPlaying);
    audioEl.addEventListener('pause', this.onPause);
    audioEl.addEventListener('ended', this.onEnded);
  }

  componentWillUnmount() {
    this.stopAnimation();
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

  private onCanvasElMountOrUnmount = (ref?: HTMLCanvasElement): void => {
    if (!ref) {
      return;
    }

    this.canvasEl = ref;
  }

  private onPlaying = () => {
    this.draw();
  }

  private draw = (): void => {
    if (!this.canvasEl) return;

    const context = this.canvasEl.getContext('2d');

    if (!context) {
      return;
    }

    this.canvasContext = context;
    this.drawBars();
  }

  private drawBars = (): void => {
    const {canvasContext, width: canvasWidth, height: canvasHeight} = this;
    if (!canvasContext) return;

    const {analyser} = this.props;

    // clear the canvas
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const maxNumBarsToDraw = 64;
    const barValues = analyser.getBucketedByteFrequencyData(maxNumBarsToDraw);
    const barWidth = canvasWidth / barValues.length;

    // draw the bars
    const maxByteValue = 256;
    for (let i = 0; i < barValues.length; i++) {
      const x = i * barWidth + i;

      const percentBarHeight = barValues[i] / maxByteValue;
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
    this.animationId && cancelAnimationFrame(this.animationId);
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
