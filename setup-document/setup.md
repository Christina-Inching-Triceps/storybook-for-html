# Storybook for HTMLの構築

Storybook for HTMLの設定手順を記録します。  

## ディレクトリ構成

デフォルトのディレクトリ構成だとやや使いづらい部分があるので、少し変更しています。  
最終的には以下のようにしていきますので、それを前提に参考にしてください。  

```sh
.
├── docker-compose.yaml
├── package.json
├── src
│   └── components
│       └── Button
└── yarn.lock
```

## Dockerの導入

## html, scssの設定

### dependencies追加

```sh
# sass利用をするため追加
yarn add -D node-sass sass-loader css-loader style-loader
# htmlを切り出してimportするため
yarn add -D html-loader extract-loader
```

htmlファイルをimportして別ファイルで管理するためにhtml-loaderを追加しています。  

### 設定ファイル群の追加・修正

storybookはデフォルトでは`./storybook/`以下に設定ファイルが置かれることが想定されているようです。  
typescriptやsacc利用のための設定をこれから追加していきます。  

#### main.js

私はwebpackに詳しくないため詳細は説明できませんが、ファイルに対する正規表現とそれに対する読み込み関連設定をしているみたいです。  

`.storybook/main.js`
```javascript
const path = require('path');

module.exports = {
  webpackFinal: async config => {

    // add sass setting
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // add html setting
    config.module.rules.push({
      test: /\.html$/,
      loaders: ['extract-loader', 'html-loader'],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  },
};
```

#### config.js

元々main.jsに記載されていたstorybookのコンテンツとして読み込みファイルを設定していきます。  

`.storybook/config.js`
```javascript
import { configure } from '@storybook/html'

function loadStories() {
  const req = require.context('../src', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
```

今回はファイルを`src/**`に配置していくため、このような設定になっています。  

## storyファイルの追加

サンプルにボタンコンポーネントを追加してみます。  

`src/components/Button/button.stories.js`
```typescript
import './_index.scss';
import { storiesOf } from '@storybook/html';

storiesOf('Components', module)
  .add('button', () => `
     <button class="Button" type="button">ボタン</button>
  `);
```

`src/components/Button/_index.scss`
```sass
@charset "UTF-8";

.Button {
  border:        2px solid red;
  font-weight:   bold;
}
```

sassファイルの名前はjs側でのimportに合わせて設定可能です。  

## ファイルの切り出し

html-loaderの設定をしているのでhtmlファイルを別ファイルとしてimportできるようになっています。  
試しに別ファイルにして読み込んでみましょう。  

`src/components/Button/button.stories.js`
```javascript
import './_index.scss';
import { storiesOf } from '@storybook/html';
import defaultButton from './default.html';
import primaryButton from './primary.html';

storiesOf('Components', module)
  .add('default', () => defaultButton)
  .add('primary', () => primaryButton);
```

`src/components/Button/default.html`
```html
<button class="Button" type="button">ボタン</button>
```

`src/components/Button/primary.html`
```html
<button class="Button primary" type="button">ボタン</button>
```

これで対応は完了です。  
このようにすることでhtmlとcssを別ファイルに切り出せるので、実装がしやすくなりますね。  

## 動作の確認




# 引用・参照

以下のサイトや記事を参考にさせていただきました！  

- [Storybook で私とみんなのコンポーネントカタログ作成してこ](https://qiita.com/higemoja/items/965b1827a635275da78c)
- [Storybook公式](https://storybook.js.org/docs/guides/guide-html/)
