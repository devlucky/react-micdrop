import * as React from 'react';
import {Component, RefObject} from 'react';
import { Analyser } from './analyser';
import { AudioBars } from './bars';
import { Color, Dimensions } from './domain';

export interface MicDropFromRefProps {
  audioRef: RefObject<HTMLAudioElement>;
  barNumber?: number;
  dimensions?: Dimensions;
  color?: Color;
}

export interface MicDropFromRefState {
  analyser?: Analyser;
}

// TODO: move this into util and ensure we only do it once
const audioContext = new AudioContext();

export class MicDropFromRef extends Component<MicDropFromRefProps, MicDropFromRefState> {
  state: MicDropFromRefState = {

  }

  componentDidMount() {
    const {audioRef} = this.props;

    this.createAnalyser(audioRef.current)
  }

  private createAnalyser = (audioElement: HTMLAudioElement | null) => {
    if (!audioElement) {
      return;
    }

    this.setState({
      analyser: new Analyser({audioEl: audioElement, audioContext})
    });
  }

  renderBars = () => {
    const {analyser} = this.state;
    const {barNumber, dimensions, color} = this.props;
    if (!analyser) return;

    return (
      <AudioBars
        analyser={analyser}
        barNumber={barNumber}
        dimensions={dimensions}
        color={color}
      />
    )
  }

  render() {
    return (
      <div>
        {this.renderBars()}
      </div>
    );
  }
}
