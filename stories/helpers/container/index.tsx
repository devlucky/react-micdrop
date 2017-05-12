import * as React from 'react';
import { Component } from 'react';

import { Wrapper, Audio } from './styled';
import { AudioBars } from '../../../src';

export interface StoryContainerState {
  audioEl?: HTMLAudioElement;
}

export class StoryContainer extends Component<{}, StoryContainerState> {
  constructor(props: {}) {
    super(props);
    this.state = {audioEl: undefined};
  }

  render() {
    const {audioEl} = this.state;

    const audioBars = audioEl ? (
      <AudioBars 
        audioEl={audioEl}
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