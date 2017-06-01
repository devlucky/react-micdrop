import * as React from 'react';
import {shallow} from 'enzyme';

import {AudioBars} from './';

describe('AudioBars', () => {
  describe('componentDidMount', () => {
    it('registers event listeners', () => {
      const audioEl = {addEventListener: jest.fn()};
      const analyser = {audioEl} as any;

      const wrapper = shallow(<AudioBars analyser={analyser} />);
      wrapper.instance().componentDidMount();

      const {addEventListener} = audioEl;
      expect(addEventListener).toHaveBeenCalledTimes(3);
      expect(addEventListener.mock.calls[0][0]).toEqual('playing');
      expect(addEventListener.mock.calls[1][0]).toEqual('pause');
      expect(addEventListener.mock.calls[2][0]).toEqual('ended');
    });
  });

  describe('render', () => {
    it('default width passed to BarsCanvas is 400px', () => {
      const analyser = {} as any;
      const wrapper = shallow(<AudioBars analyser={analyser} />);

      expect(wrapper.props().width).toEqual(400);
    });

    it('default height passed to BarsCanvas is 400px', () => {
      const analyser = {} as any;
      const wrapper = shallow(<AudioBars analyser={analyser} />);

      expect(wrapper.props().height).toEqual(400);
    });

    it('passes dimensions to BarsCanvas', () => {
      const analyser = {} as any;
      const dims = {width: 200, height: 200};
      const wrapper = shallow(<AudioBars analyser={analyser} dimensions={dims} />);

      expect(wrapper.props().height).toEqual(dims.height);
      expect(wrapper.props().width).toEqual(dims.width);
    });
  });

  describe('drawBars', () => {
    let freqData: Array<number>;
    let analyser;
    let canvasContext;

    beforeEach(() => {
      window.requestAnimationFrame = jest.fn();

      freqData = [1, 2, 3, 4];
      analyser = {
        getBucketedByteFrequencyData: jest.fn().mockReturnValue(freqData)
      } as any;

      canvasContext = {clearRect: jest.fn(), fillRect: jest.fn()};
    });

    it('clears the canvas', () => {
      const canvasDimensions = {width: 100, height: 200};
      const wrapper = shallow(<AudioBars analyser={analyser} dimensions={canvasDimensions} />);

      wrapper.instance().canvasContext = canvasContext;
      wrapper.instance().drawBars();

      expect(canvasContext.clearRect).toHaveBeenCalledTimes(1);
      expect(canvasContext.clearRect).toHaveBeenLastCalledWith(
        0 , 0, canvasDimensions.width, canvasDimensions.height
      );
    });

    it('draws the correct number of bars to the canvas', () => {
      const wrapper = shallow(<AudioBars analyser={analyser} />);

      wrapper.instance().canvasContext = canvasContext;
      wrapper.instance().drawBars();

      expect(canvasContext.fillRect).toHaveBeenCalledTimes(freqData.length);
    });

    it('draws the first bar with the correct dimensions to the canvas', () => {
      const canvasDimensions = {width: 100, height: 200};
      const wrapper = shallow(<AudioBars analyser={analyser} dimensions={canvasDimensions} />);

      wrapper.instance().canvasContext = canvasContext;
      wrapper.instance().drawBars();

      const oneByte = 256;
      const firstBarHeight = (1 / oneByte) * canvasDimensions.height;
      const firstBarWidth = canvasDimensions.width / freqData.length;
      expect(canvasContext.fillRect).toHaveBeenCalledWith(
        0, 
        canvasDimensions.height - firstBarHeight, 
        firstBarWidth, 
        firstBarHeight
      );
    });
  });
});
