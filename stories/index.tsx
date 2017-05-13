import * as React from 'react';
import { storiesOf } from '@kadira/storybook';

import { StoryContainer } from './helpers/container';

const audioContext = new AudioContext();

storiesOf('AudioBars', module)
  .add('default', () => {
    return <StoryContainer audioContext={audioContext} />;
  });
