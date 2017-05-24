/// <reference types="react" />
import { Component } from 'react';
import { Analyser } from '../../../src';
export interface StoryContainerProps {
    audioContext: AudioContext;
}
export interface StoryContainerState {
    analyser?: Analyser;
}
export declare class StoryContainer extends Component<StoryContainerProps, StoryContainerState> {
    constructor(props: StoryContainerProps);
    render(): JSX.Element;
    private getAudioElement;
}
