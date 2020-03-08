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

今回はDockerを利用して環境をセットアップします。  
nodeのバージョンを管理して利用するのが面倒だからです。  

### docker-compose.yamlの作成

```yaml
version: '3'
services:
  storybook:
    image: node:13.8.0-alpine3.11
    container_name: storybook
    volumes:
      - ./:/app
    working_dir: /app
    tty: true
    ports:
      - 6006:6006
```

nodeとyarnが使える環境として用意したいだけなので、シンプルにしてあります。  
yarnでインストールするパッケージなどは`package.json`で管理されているので、Dockerfileにして書かなくても良いかなと思っています。  

## package.json補足

このリポジトリでは以下のパッケージを追加しています。  

```sh
# sass利用をするため追加
yarn add -D node-sass sass-loader css-loader style-loader 
# htmlを切り出してimportするため
yarn add -D html-loader extract-loader
# 便利なaddon
yarn add -D @storybook/addon-docs @storybook/addon-viewport @storybook/addon-storysource
# ソースコード表示のため
yarn add -D @storybook/source-loader
```

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

    // add display source setting
    config.module.rules.push({
      test: /\.stories\.js?$/,
      use: [
        {
          loader: require.resolve('@storybook/source-loader'),
          options: { injectParameters: true },
        },
      ],
      include: [path.resolve(__dirname, '../src')],
      enforce: 'pre',
    });

    return config;
  },
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-viewport',
    '@storybook/addon-storysource'
  ]
};
```

各loaderの追加とaddonの追加を行っています。  


#### config.js

storybook全体の設定を行うファイルです。  
preview.jsなどに記載すべき設定もこの中で行っていきます。  
config.jsとpreview.jsは共存できないようで、結果的にconfig.jsにまとめる形になります。  

`.storybook/config.js`
```javascript
import { configure, addParameters } from '@storybook/html'
import {
  INITIAL_VIEWPORTS,
} from '@storybook/addon-viewport';

// preview settings
const customViewports = {
  kindleFire2: {
    name: 'Kindle Fire 2',
    styles: {
      width: '600px',
      height: '963px',
    },
  },
  kindleFireHD: {
    name: 'Kindle Fire HD',
    styles: {
      width: '533px',
      height: '801px',
    },
  },
};

addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
      ...customViewports,
    },
  },
});

function loadStories() {
  const req = require.context('../src', true, /\.stories\.js$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
```

今回はファイルを`src/**`に配置していくため、このような設定になっています。  
またconfigure()の前にviewportの読み込みをしないと正しく反映されないので注意してください。  


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

# TODO

- importしたhtmlソースが表示できない
- docsを導入しているがあまり意味がない

# 引用・参照

以下のサイトや記事を参考にさせていただきました！  

- [Storybook で私とみんなのコンポーネントカタログ作成してこ](https://qiita.com/higemoja/items/965b1827a635275da78c)
- [Storybook公式](https://storybook.js.org/docs/guides/guide-html/)
