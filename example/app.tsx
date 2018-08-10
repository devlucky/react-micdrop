import * as React from 'react';
import {Component} from 'react';
import {GHCorner} from 'react-gh-corner';
import { StoryContainer } from './container';
import {AppWrapper} from './styled';

export interface AppState {
  
}

const repoUrl = 'https://github.com/devlucky/react-micdrop';
const audioContext = new AudioContext();

export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }

  render() {
    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        <StoryContainer audioContext={audioContext} />
      </AppWrapper>
    )
  }
}