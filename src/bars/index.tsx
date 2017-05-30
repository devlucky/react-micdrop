import * as React from 'react';
import {Component} from 'react';
import chunk = require('lodash.chunk');
import sum = require('lodash.sum');

import {Analyser} from '../analyser';
import {Dimensions} from '../utils/dimensions';
import {BarsCanvas} from './styled';

export interface AudioBarsProps {
  analyser: Analyser;
  dimensions?: Dimensions;
  barWidth?: number;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;
  private animationId: number;
  private dataArray: Uint8Array;

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

  private onCanvasElMountOrUnmount = (ref: HTMLCanvasElement): void => {
    if (!ref) {
      return;
    }

    this.canvasEl = ref;
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

    const {analyserNode} = this.props.analyser;
    const bufferLength = analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.drawBars();
  }

  private drawBars = (): void => {
    const {canvasContext, barWidth, numBarsToDraw, dataArray, width: canvasWidth, height: canvasHeight} = this;
    const {analyser} = this.props;
    // clear the canvas
    // TODO [Perf] we can store the higher bar value XY and only clear the canvas from those points
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const {analyserNode} = analyser;
    const maxByteValue = 256;
    analyserNode.getByteFrequencyData(dataArray);

    const bufferLength = dataArray.length;

    // chunk values if too many to display
    const numValuesPerChunk = Math.ceil(bufferLength / numBarsToDraw);
    const chunkedData = chunk(dataArray, numValuesPerChunk);
    const barValues = chunkedData.map((arr: Array<number>) => sum(arr) / arr.length);

    // draw the bars
    for (let i = 0; i < barValues.length; i++) {
      const x = i * barWidth + i;

      if (x >= canvasWidth) {break;} // Don't paint bars outside the canvas

      const percentBarHeight = barValues[i] / maxByteValue;
      const barHeight = canvasHeight * percentBarHeight;
      if (barHeight < 1) {continue;} // Don't paint invisible bars

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

  private get barWidth(): number {
    const {barWidth} = this.props;
    if (barWidth) { return barWidth; }

    const {width: canvasWidth, numBarsToDraw} = this;

    return canvasWidth / numBarsToDraw;
  }

  private get numBarsToDraw(): number {
    const {width, barWidth, dataArray} = this;
    const maxBarsToDraw = width / barWidth;

    return Math.min(dataArray.length, maxBarsToDraw);
  }
}
