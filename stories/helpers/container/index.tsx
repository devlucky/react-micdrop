import * as React from 'react';
import { Component } from 'react';

import { Wrapper, Audio } from './styled';
import { AudioBars } from '../../../src';

export interface StoryContainerProps {
  audioContext: AudioContext;
}

export interface StoryContainerState {
  audioEl?: HTMLAudioElement;
}

export class StoryContainer extends Component<StoryContainerProps, StoryContainerState> {
  constructor(props: StoryContainerProps) {
    super(props);
    this.state = {audioEl: undefined};
  }

  render() {
    const {audioContext} = this.props;
    const {audioEl} = this.state;

    const audioBars = audioEl ? (
      <AudioBars 
        audioEl={audioEl}
        audioContext={audioContext}
      />
    ) : null;

    return (
      <Wrapper>
        <Audio 
          src="./music.mp3" 
          loop={true}
          controls={true}
          innerRef={this.getAudioElement} 
        />
        {audioBars}
      </Wrapper>
    );
  }

  private getAudioElement = (ref: HTMLAudioElement) => {
    if (!ref) {
      return;
    }

    this.setState({audioEl: ref});
  }
}