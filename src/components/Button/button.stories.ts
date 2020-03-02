import './_index.scss';
import { storiesOf } from '@storybook/html';

storiesOf('Components', module)
  .add('button', () => `
     <button class="Button" type="button">ボタン</button>
  `);
