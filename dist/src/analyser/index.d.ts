export interface AnalyserSpec {
    audioEl: HTMLAudioElement;
    audioContext: AudioContext;
}
export interface Analyser {
    audioEl: HTMLAudioElement;
    analyserNode: AnalyserNode;
    closeAudioNodes: () => void;
}
export declare class Analyser {
    audioEl: HTMLAudioElement;
    analyserNode: AnalyserNode;
    private source;
    constructor(spec: AnalyserSpec);
    closeAudioNodes: () => void;
    private createAnalyserNode;
}
