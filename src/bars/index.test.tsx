import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AudioBars} from './';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AudioBars />, div);
});
