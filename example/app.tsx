import * as React from 'react';
import {Component, ChangeEvent} from 'react';
import {GHCorner} from 'react-gh-corner';
import Button from '@atlaskit/button';
import {AppWrapper, MicDropWrapper} from './styled';
import { MicDrop } from '../src';
import { Dimensions } from '../src/utils/dimensions';

export interface AppState {
  isPlaying: boolean; 
  barNumber: number;
  barWidth: number;
  dimensions: Dimensions;
}

const src = '/example/assets/music.mp3';
const repoUrl = 'https://github.com/devlucky/react-micdrop';

export default class App extends Component <{}, AppState> {
  state: AppState = {
    isPlaying: true,
    barNumber: 50,
    barWidth: 10,
    dimensions: {
      width: 500,
      height: 400
    }
  }

  togglePlay = () => {
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  }

  changeWidth = (e: ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    this.setState({
      dimensions: {
        ...this.state.dimensions,
        width
      }
    })
  }
 
  changeHeight = (e: ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(e.target.value);
    this.setState({
      dimensions: {
        ...this.state.dimensions,
        height
      }
    })
  }

  changeBarWidth = (e: ChangeEvent<HTMLInputElement>) => {
    const barWidth = parseInt(e.target.value);
    this.setState({barWidth})
  }

  changeBarNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const barNumber = parseInt(e.target.value);
    this.setState({barNumber})
  }

  render() {
    const {isPlaying, barNumber, barWidth, dimensions} = this.state;
    const toggleButtonText = isPlaying ? 'pause' : 'play';

    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        <MicDropWrapper>
          <MicDrop
            src={src}
            isPlaying={isPlaying}
            barNumber={barNumber}
            barWidth={barWidth}
            dimensions={dimensions}
          />
        </MicDropWrapper>
        <div>
          <Button shouldFitContainer appearance="primary" onClick={this.togglePlay}>
            {toggleButtonText}
          </Button>
          <div>
            Bar width <input type="number" value={barWidth} onChange={this.changeBarWidth} />
            Bar number <input type="number" value={barNumber} onChange={this.changeBarNumber} />
          </div>
          <div>
            Dimensions
            <input type="number" value={dimensions.width} onChange={this.changeWidth} /> x 
            <input type="number" value={dimensions.height} onChange={this.changeHeight} />
          </div>
        </div>
      </AppWrapper>
    )
  }
}