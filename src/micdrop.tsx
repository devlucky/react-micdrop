import * as React from 'react';
import {Component} from 'react';
import { Analyser } from './analyser';
import { AudioBars } from './bars';
import { Audio } from './styled';
import { Dimensions } from './utils/dimensions';

export interface MicDropProps {
  src: string;
  // autoPlay?: boolean; // TODO: does this make sense or just pass isPlaying=true initially
  isPlaying?: boolean;
  loop?: boolean;
  barWidth?: number;
  barNumber?: number;
  dimensions?: Dimensions;
}

export interface MicDropState {
  analyser?: Analyser;
}

const audioContext = new AudioContext();

export class MicDrop extends Component<MicDropProps, MicDropState> {
  audioElement?: HTMLAudioElement;
  state: MicDropState = {

  }

  static defaultProps: Partial<MicDropProps> = {
    isPlaying: false,
    loop: false
  }

  componentWillReceiveProps(nextProps: MicDropProps) {
    const {isPlaying} = this.props;
    const {isPlaying: nextIsPlaying} = nextProps;

    if (isPlaying !== nextIsPlaying) {
      this.togglePlay();
    }
  }

  private getAudioElement = (audioElement?: HTMLAudioElement) => {
    const {isPlaying} = this.props;
    if (!audioElement) {
      return;
    }    

    this.audioElement = audioElement;

    if (isPlaying) {
      this.togglePlay();
    }

    this.setState({
      analyser: new Analyser({audioEl: audioElement, audioContext})
    });
  }

  togglePlay = () => {
    const {audioElement} = this;

    if (!audioElement) return;

    if (audioElement.paused) {
      audioElement.play();
    } else {
      audioElement.pause();
    }
  }

  renderBars = () => {
    const {analyser} = this.state;
    const {barWidth, barNumber, dimensions} = this.props;
    if (!analyser) return;

    return (
      <AudioBars 
        analyser={analyser}
        barWidth={barWidth}
        barNumber={barNumber}
        dimensions={dimensions}
      />
    )
  }

  render() {
    const {src, loop} = this.props;
    
    return (
      <div>
        <Audio
          src={src}
          loop={loop}
          innerRef={this.getAudioElement} 
        />
        {this.renderBars()}
      </div>
    );
  }
}