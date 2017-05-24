/// <reference types="react" />
import { Component } from 'react';
import { Analyser } from '../analyser';
import { Dimensions } from '../utils/dimensions';
export interface AudioBarsProps {
    analyser: Analyser;
    dimensions?: Dimensions;
}
export declare class AudioBars extends Component<AudioBarsProps, {}> {
    private canvasEl;
    private canvasContext;
    private animationId;
    private dataArray;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private onCanvasElMountOrUnmount;
    private onPlaying;
    private draw;
    private drawBars;
    private onPause;
    private onEnded;
    private stopAnimation;
    private readonly width;
    private readonly height;
}
