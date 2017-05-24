import * as React from 'react';
import { Component } from 'react';

import { Analyser, AudioBars, AudioCircle } from '../../../src';
import { Wrapper, VisualisationsContainer, Visualisation, Audio } from './styled';

export interface StoryContainerProps {
  audioContext: AudioContext;
}

export interface StoryContainerState {
  analyser?: Analyser;
}

export class StoryContainer extends Component<StoryContainerProps, StoryContainerState> {
  constructor(props: StoryContainerProps) {
    super(props);
    this.state = {analyser: undefined};
  }

  render() {
    const {analyser} = this.state;

    const audioBars = analyser ? (
      <div style={{marginRight: '20px'}}> 
        <AudioBars 
          analyser={analyser}
        />
      </div>
    ) : null;

    const audioCircle = analyser ? (
      <div> 
        <AudioCircle 
          analyser={analyser}
        />
      </div>
    ) : null;

    return (
      <Wrapper>
        <Audio 
          src="./music.mp3" 
          loop={true}
          controls={true}
          innerRef={this.getAudioElement} 
        />
        <VisualisationsContainer>
          <Visualisation>
            <h2>AudioBars</h2>
            {audioBars}
          </Visualisation>
          <Visualisation>
            <h2>AudioCircle</h2>
            {audioCircle}
          </Visualisation>
        </VisualisationsContainer>
      </Wrapper>
    );
  }

  private getAudioElement = (audioEl: HTMLAudioElement) => {
    const {audioContext} = this.props;

    if (!audioEl) {
      return;
    }

    this.setState({analyser: new Analyser({audioEl, audioContext})});
  }
}