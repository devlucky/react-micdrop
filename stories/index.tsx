import * as React from 'react';
import { storiesOf } from '@kadira/storybook';
import { AudioBars } from '../src';

storiesOf('AudioBars', module)
  .add('with text', () => {
    return <AudioBars />;
  });
