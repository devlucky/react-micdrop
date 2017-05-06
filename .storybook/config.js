import { configure } from '@kadira/storybook';
import '@kadira/storybook/addons';

function loadStories() {
  require('../stories/index.tsx');
}

configure(loadStories, module);
