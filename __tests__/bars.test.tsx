import * as React from 'react';
import {shallow} from 'enzyme';

import {AudioBars, AudioBarsProps} from '../src/bars';

describe('AudioBars', () => {
  beforeEach(() => {
    window.requestAnimationFrame = jest.fn();
  });

  const setup = (props?: Partial<AudioBarsProps>) => {
    const audioEl = {addEventListener: jest.fn()};
    const freqData = [1, 2, 3, 4];
    const analyser = {
      getBucketedByteFrequencyData: jest.fn().mockReturnValue(freqData),
      audioEl
    } as any;
    const dimensions = {width: 100, height: 200};
    const component = shallow(<AudioBars dimensions={dimensions} analyser={analyser} {...props} />);
    const canvasContext = {clearRect: jest.fn(), fillRect: jest.fn()};
    const instance = component.instance() as any;

    instance.canvasContext = canvasContext;

    return {
      component,
      analyser,
      audioEl,
      canvasContext,
      instance,
      freqData,
      dimensions
    }
  };

  describe('componentDidMount', () => {
    it('registers event listeners', () => {
      const {audioEl, analyser} = setup();
      const {addEventListener} = audioEl;
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toEqual('playing');
      expect(addEventListener.mock.calls[1][0]).toEqual('pause');
      expect(addEventListener.mock.calls[2][0]).toEqual('ended');
    });
  });

  describe('render', () => {
    it('default width passed to BarsCanvas is 400px', () => {
      const {component} = setup({dimensions: undefined});

      expect(component.props().width).toEqual(400);
    });

    it('default height passed to BarsCanvas is 400px', () => {
      const {component} = setup({dimensions: undefined});

      expect(component.props().height).toEqual(400);
    });

    it('passes dimensions to BarsCanvas', () => {
      const {component} = setup({
        dimensions: {width: 200, height: 200}
      });

      expect(component.props().height).toEqual(200);
      expect(component.props().width).toEqual(200);
    });
  });

  describe('drawBars', () => {
    it('clears the canvas', () => {
      const {instance, canvasContext} = setup();

      instance.drawBars();

      expect(canvasContext.clearRect).toHaveBeenCalledTimes(1);
      expect(canvasContext.clearRect).toHaveBeenLastCalledWith(
        0 , 0, 100, 200
      );
    });

    it('draws the correct number of bars to the canvas', () => {
      const {instance, canvasContext, freqData} = setup();

      instance.drawBars();

      expect(canvasContext.fillRect).toHaveBeenCalledTimes(3);
    });

    it.skip('draws the first bar with the correct dimensions to the canvas', () => {
      const {dimensions, instance, canvasContext, freqData} = setup();

      instance.drawBars();

      const oneByte = 256;
      const firstBarHeight = (1 / oneByte) * dimensions.height;
      const firstBarWidth = dimensions.width / freqData.length;

      expect(canvasContext.fillRect).toHaveBeenCalledWith(
        0,
        dimensions.height - firstBarHeight,
        firstBarWidth,
        firstBarHeight
      );
    });
  });
});
