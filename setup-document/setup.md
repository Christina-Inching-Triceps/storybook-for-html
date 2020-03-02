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
├── tsconfig.json
└── yarn.lock
```

## Dockerの導入

## typescript設定

[公式サイト](https://storybook.js.org/docs/configurations/typescript-config/)のドキュメントを参考に設定していきます。  

### dependencies追加

```sh
yarn add -D typescript
yarn add -D ts-loader
# sass利用をするため追加
yarn add -D node-sass sass-loader css-loader style-loader
```

### 設定ファイル群の追加・修正

storybookはデフォルトでは`./storybook/`以下に設定ファイルが置かれることが想定されているようです。  
typescriptやsacc利用のための設定をこれから追加していきます。  

#### main.js

[こちら](https://storybook.js.org/docs/configurations/typescript-config/#setting-up-typescript-with-ts-loader)の内容を参考に設定していきます。  
私はwebpackに詳しくないため詳細は説明できませんが、ファイル認識の設定とファイルロードの設定をしているようですね。  

`.storybook/main.js`
```javascript
const path = require('path');

module.exports = {
  webpackFinal: async config => {

    // add ts setting
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('ts-loader'),
        },
      ],
    });

    // add sass setting
    config.module.rules.push({
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, '../'),
      });

    config.resolve.extensions.push('.ts', '.tsx');
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
  const req = require.context('../src', true, /\.stories\.ts$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
```

私はtsxの拡張子を利用しないので、tsファイルのみを読み込むようにしています。  
今回はファイルを`src/**`に配置していくため、このような設定になっています。  


#### tsconfig.json

`tsconfig.json`
```json
{
  "compilerOptions": {
    "outDir": "build/lib",
    "module": "commonjs",
    "target": "es5",
    "lib": ["es5", "es6", "es7", "es2017", "dom"],
    "sourceMap": true,
    "allowJs": false,
    "moduleResolution": "node",
    "rootDirs": ["src", "stories"],
    "baseUrl": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": false,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "suppressImplicitAnyIndexErrors": false,
    "noUnusedLocals": true,
    "declaration": false,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "build", "scripts"]
}
```

tsconfigは公式サイトにある内容から一部緩くしたりreactを削除した状態です。  
ここは各々好きに設定していただければ大丈夫です。  


## storyファイルの追加

サンプルにボタンコンポーネントを追加してみます。  

`src/components/Button/button.stories.ts`
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

sassファイルの名前はts側でのimportに合わせて設定可能です。  

## 動作の確認




# 引用・参照

以下のサイトや記事を参考にさせていただきました！  

- [Storybook で私とみんなのコンポーネントカタログ作成してこ](https://qiita.com/higemoja/items/965b1827a635275da78c)
- [Storybook公式](https://storybook.js.org/docs/guides/guide-html/)
