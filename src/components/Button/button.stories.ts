import './_index.scss';
import { storiesOf } from '@storybook/html';
import defaultButton from './default.html';
import primaryButton from './primary.html';

storiesOf('Components', module)
  .add('default', () => defaultButton)
  .add('primary', () => primaryButton);
