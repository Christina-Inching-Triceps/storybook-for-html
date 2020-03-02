# Storybook for HTMLの導入用サンプル

プロダクトへStorybook for HTMLを導入するための設定手順とサンプルを作成しました。

# Requirement

- docker

# Installation

```bash
$ git clone git@github.com:Christina-Inching-Triceps/storybook-for-html.git
$ cd {project_root}
$ docker-compse up -d
```
# Usage

## storybookの起動

```bash
$ docker-compse up -d
```

起動後にブラウザから以下へアクセス  
[http://localhost:6006](http://localhost:6006)

## 動作が不安定になったとき


```bash
$ docker-compose down
$ docker-compose up -d
```

もしくは以下のコマンドでコンテナに入り直接操作

```bash
$ docker-compose exec storybook sh
/app#
```

# Author

- christina.inching.triceps

# License

MIT License
