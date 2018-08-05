import * as React from 'react';
import {Component} from 'react';
import {GHCorner} from 'react-gh-corner';
import {AppWrapper} from './styled';
import story from './stories';

export interface AppState {
  
}
const repoUrl = 'https://github.com/devlucky/react-micdrop';
export default class App extends Component <{}, AppState> {
  state: AppState = {
    
  }

  render() {
    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        {story}
      </AppWrapper>
    )
  }
}