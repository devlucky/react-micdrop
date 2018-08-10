import * as React from 'react';
import {Component} from 'react';

import {Analyser} from '../analyser';
import {Dimensions} from '../utils/dimensions';
import {BarsCanvas} from './styled';

export interface AudioBarsProps {
  analyser: Analyser;
  dimensions?: Dimensions;
  barWidth?: number;
  barNumber?: number;
}

const maxNumBarsToDraw = 64;
const maxByteValue = 256;
const defaultBarNumber = 30;

// TODO: Play with alpha channel based on height?
const getFillStyle = (height: number): string => {
  const red = Math.round(87 + (169 * height));

  return `rgba(${red}, 175, 229, 1)`;
}

export class AudioBars extends Component<AudioBarsProps, {}> {
  private canvasEl?: HTMLCanvasElement;
  private canvasContext?: CanvasRenderingContext2D;
  private animationId?: number;

  static defaultProps: Partial<AudioBarsProps> = {
    barNumber: defaultBarNumber
  }

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
        innerRef={this.saveCanvasRef}
      />
    );
  }

  private saveCanvasRef = (ref?: HTMLCanvasElement): void => {
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

  // TODO-Perf: we can store the higher bar value XY and only clear the canvas from those points
  private clearCanvas = () => {
    const {canvasContext, width, height} = this;
    if (!canvasContext) return;
    canvasContext.clearRect(0, 0, width, height);
  }

  private drawBars = (): void => {
    const {canvasContext, barWidth, width: canvasWidth, height: canvasHeight} = this;
    const {analyser} = this.props;
    if (!canvasContext) return;

    const barValues = analyser.getBucketedByteFrequencyData(maxNumBarsToDraw);
    this.clearCanvas();

    for (let i = 0; i < barValues.length; i++) {
      const x = i * barWidth + i;
      if (x >= canvasWidth) {break;} // Don't paint bars outside the canvas

      const percentBarHeight = barValues[i] / maxByteValue;
      const barHeight = canvasHeight * percentBarHeight;
      
      if (barHeight < 1) {continue;} // Don't paint invisible bars

      canvasContext.fillStyle = getFillStyle(percentBarHeight)
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

  private get barWidth(): number {
    const {barWidth} = this.props;
    if (barWidth) { return barWidth; }

    const {width: canvasWidth, barNumber} = this;
    return canvasWidth / barNumber;
  }

  private get barNumber(): number {
    const {barNumber = defaultBarNumber} = this.props;
    return Math.min(barNumber, maxNumBarsToDraw);
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
