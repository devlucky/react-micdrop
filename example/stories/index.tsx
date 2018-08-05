import * as React from 'react';
import { StoryContainer } from './helpers/container';

const audioContext = new AudioContext();

export default <StoryContainer audioContext={audioContext} />;
