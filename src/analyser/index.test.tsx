import {Analyser} from './';

interface MockNode {
  connect: Function;
  disconnect: Function;
}

describe('Analyser', () => {
  let sourceNode: MockNode;
  let analyserNode: MockNode;
  let destinationNode: MockNode;
  let audioContext: AudioContext;
  let audioEl: HTMLAudioElement;
  let analyser: Analyser;

  beforeEach(() => {
    sourceNode = {
      connect: jest.fn(),
      disconnect: jest.fn()
    };

    analyserNode = {
      connect: jest.fn(),
      disconnect: jest.fn()
    };

    destinationNode = {
      connect: jest.fn(),
      disconnect: jest.fn()
    };

    audioContext = {
      destination: destinationNode,
      createMediaElementSource: jest.fn().mockReturnValue(sourceNode),
      createAnalyser: jest.fn().mockReturnValue(analyserNode)
    } as any;

    audioEl = document.createElement('audio');

    analyser = new Analyser({audioContext, audioEl});
  });

  describe('constructor', () => {
    it('stores passed in HTMLAudioElement on instance', () => {
      expect(analyser.audioEl).toEqual(audioEl);
    });

    it('creates source node', () => {
      const {createMediaElementSource} = audioContext;
      expect(createMediaElementSource).toHaveBeenCalledTimes(1);
      expect(createMediaElementSource).toBeCalledWith(audioEl);
    });

    it('creates an analyser node', () => {
      expect(audioContext.createAnalyser).toHaveBeenCalledTimes(1);
    });

    it('sets analyser node property on analyser instance', () => {
      expect(analyser.analyserNode).toEqual(analyserNode);
    });

    it('connects the source node to the analyser node', () => {
      expect(sourceNode.connect).toHaveBeenCalledTimes(1);
      expect(sourceNode.connect).toBeCalledWith(analyserNode);
    });

    it('connects the analyser node to the destination node', () => {
      expect(analyserNode.connect).toHaveBeenCalledTimes(1);
      expect(analyserNode.connect).toBeCalledWith(destinationNode);
    });
  });

  describe('closeAudioNodes', () => {
    it('disconnects the source and analyser nodes', () => {
      analyser.closeAudioNodes();
      expect(sourceNode.disconnect).toHaveBeenCalledTimes(1);
      expect(analyserNode.disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
