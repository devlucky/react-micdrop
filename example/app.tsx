import * as React from 'react';
import {Component, ChangeEvent} from 'react';
import {GHCorner} from 'react-gh-corner';
import Button from '@atlaskit/button';
import VideoRenderer from 'react-video-renderer';
import {AppWrapper, MicDropWrapper, MicDropsWrapper} from './styled';
import MicDrop, { MicDropFromRef } from '../src';
import { Dimensions } from '../src/domain';

export interface AppState {
  isPlaying: boolean;
  barNumber: number;
  dimensions: Dimensions;
  color?: string;
}

const src = './assets/music.mp3';
const repoUrl = 'https://github.com/devlucky/react-micdrop';

export default class App extends Component <{}, AppState> {
  state: AppState = {
    isPlaying: false,
    barNumber: 30,
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

  changeBarNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const barNumber = parseInt(e.target.value);
    this.setState({barNumber})
  }

  changeColor = (e: ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;

    this.setState({
      color
    });
  }

  render() {
    const {isPlaying, barNumber, dimensions, color} = this.state;
    const toggleButtonText = isPlaying ? 'pause' : 'play';

    return (
      <AppWrapper>
        <GHCorner openInNewTab href={repoUrl} />
        <MicDropsWrapper>
          <MicDropWrapper>
            <MicDrop
              src={src}
              isPlaying={isPlaying}
              barNumber={barNumber}
              dimensions={dimensions}
              color={color}
            />
          </MicDropWrapper>
          <MicDropWrapper>
            <VideoRenderer sourceType="audio" src={src}>
              {(audio, _, actions, audioRef) => {
                return (
                  <div>
                    {audio}
                    <MicDropFromRef
                      audioRef={audioRef}
                      barNumber={barNumber}
                      dimensions={dimensions}
                      color={color}
                    />
                    <button onClick={actions.play}>Play</button>
                    <button onClick={actions.pause}>Pause</button>
                  </div>
                )
              }}
            </VideoRenderer>
          </MicDropWrapper>
        </MicDropsWrapper>
        <div>
          <Button shouldFitContainer appearance="primary" onClick={this.togglePlay}>
            {toggleButtonText}
          </Button>
          <div>
            Bar number <input type="number" value={barNumber} onChange={this.changeBarNumber} />
          </div>
          <div>
            <input type="color" value={color} onChange={this.changeColor} />
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
