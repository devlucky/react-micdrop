import * as React from 'react';
import { storiesOf } from '@kadira/storybook';

import { StoryContainer } from './helpers/container';

storiesOf('AudioBars', module)
  .add('default', () => {
    return <StoryContainer />;
  });
