import {Analyser} from '../src';

interface MockNode {
  connect: Function;
  disconnect: Function;
}

interface MockAnalyserNode extends MockNode {
  frequencyBinCount: number;
  getByteFrequencyData: (array: Int8Array) => void;
}

describe('Analyser', () => {
  let sourceNode: MockNode;
  let analyserNode: MockAnalyserNode;
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
      disconnect: jest.fn(),
      frequencyBinCount: 10,
      getByteFrequencyData: () => {} 
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

  describe('getBucketedByteFrequencyData', () => {
    const mockAnalyserNodeWithFrequencies = (analyserNodeFrequencies: Array<number>) => {
      analyserNode.frequencyBinCount = analyserNodeFrequencies.length;

      analyserNode.getByteFrequencyData = jest.fn().mockImplementation(
        (dataArray) => {
          for (let i = 0; i < analyserNodeFrequencies.length; i++) {
            dataArray[i] = analyserNodeFrequencies[i];
          }
        }
      );
    };

    it('returns the unaltered array when there are more buckets than array entries', () => {
      const numberOfBuckets = 10;
      const analyserNodeFrequencies = [1, 2, 3, 4];
      mockAnalyserNodeWithFrequencies(analyserNodeFrequencies);

      const bucketedArray = analyser.getBucketedByteFrequencyData(numberOfBuckets);
      expect(bucketedArray).toEqual(analyserNodeFrequencies);
    });

    it('correctly buckets array when there are less buckets than array entries', () => {
      const numberOfBuckets = 4;
      const analyserNodeFrequencies = [1, 2, 3, 4, 5, 6, 7, 8];
      const expectedBucketArray = [1.5, 3.5, 5.5, 7.5];

      mockAnalyserNodeWithFrequencies(analyserNodeFrequencies);

      const bucketedArray = analyser.getBucketedByteFrequencyData(numberOfBuckets);
      expect(bucketedArray).toEqual(expectedBucketArray);
    });
  });
});
