import * as React from 'react';
import {Component} from 'react';
import {GHCorner} from 'react-gh-corner';
import Button from '@atlaskit/button';
import {AppWrapper} from './styled';
import { MicDrop } from '../src';

export interface AppState {
  isPlaying: boolean; 
}

const src = 'http://localhost:8080/example/assets/music.mp3';
const repoUrl = 'https://github.com/devlucky/react-micdrop';

export default class App extends Component <{}, AppState> {
  state: AppState = {
    isPlaying: true
  }

  togglePlay = () => {
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }

  render() {
    const {isPlaying} = this.state;
    const toggleButtonText = isPlaying ? 'pause' : 'play';

    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        <MicDrop
          src={src}
          isPlaying={isPlaying}
        />
        <div>
          <Button appearance="primary" onClick={this.togglePlay}>
            {toggleButtonText}
          </Button>
        </div>
      </AppWrapper>
    )
  }
}