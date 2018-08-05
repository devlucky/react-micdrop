import * as React from 'react';
import {Component} from 'react';
import chunk = require('lodash.chunk');
import sum = require('lodash.sum');

import {Analyser} from '../analyser';
import {Dimensions} from '../utils/dimensions';
import {CircleCanvas} from './styled';

export interface AudioCircleProps {
  analyser: Analyser;
  dimensions?: Dimensions;
}

// TODO implement this using a circle visualisation
export class AudioCircle extends Component<AudioCircleProps, {}> {
  private canvasEl?: HTMLCanvasElement;
  private canvasContext?: CanvasRenderingContext2D;
  private animationId?: number;
  private dataArray?: Uint8Array;

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
      <CircleCanvas 
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

    const {analyserNode} = this.props.analyser;
    const bufferLength = analyserNode.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.drawBars();
  }

  private drawBars = (): void => {
    const {canvasContext, width: canvasWidth, height: canvasHeight, dataArray} = this;

    if (!canvasContext || !dataArray) return;

    // clear the canvas
    canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

    const {analyserNode} = this.props.analyser;
    const maxByteValue = 256;
    analyserNode.getByteFrequencyData(dataArray);

    const numBarsToDraw = Math.min(dataArray.length, 64);
    const bufferLength = dataArray.length;

    // chunk values if too many to display
    const numValuesPerChunk = Math.ceil(bufferLength / numBarsToDraw);
    const chunkedData = chunk(dataArray, numValuesPerChunk);
    const barValues = chunkedData.map((arr: Array<number>) => sum(arr) / arr.length);

    const barWidth = canvasWidth / numBarsToDraw;

    // draw the bars
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
