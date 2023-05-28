# PokemonSoundsQuiz
Amazon Alexa Skill用のポケモン鳴き声クイズのコード一式です。

※ポケモンの音声ファイルは含まれていないため別途用意する必要があります。

## 使い方
### あなた「アレクサ、ポケモン鳴き声クイズ開いて」
### Alexa「ようこそ、ポケモン鳴き声クイズへ。第１問」
### Alexa「(ポケモンの鳴き声が再生)」
### あなた「鳴き声のポケモン名を答える」
- わからない場合は「パス」

- もう一度聞きたいときは「もう一回」
### Alexa「正解です」or「不正解です」or「よく聞き取れませんでした」
### 全部で1０問答えると、正解数を教えてくれます。 

## インストール方法
### Amazon Alexa SkillのDeveloper ConsoleでSkillを作成する
https://developer.amazon.com/ja-JP/alexa/alexa-skills-kit#

### 本レポジトリのコードをすべてダウンロードする

### ダウンロードしたコードをzip圧縮する

### コードエディタタブにある「Import Code」でzip圧縮したファイルをアップロードする
![code editor](https://github.com/Eito-H/PokemonSoundsQuiz/assets/114639781/a04f2595-b3b0-4a7d-8ed9-046c38d4455f)

### 音声ファイルの作成
ポケモンの鳴き声ファイルは著作権の関係上ご自身でご用意ください。


(参考)ポケモンGOの鳴き声ファイル

https://github.com/PokeMiners/pogo_assets/tree/master/Sounds/Pokemon%20Cries

※Alexa skillではwavの再生に対応していないためmp3変換する必要あり

## 世代の変更
第１世代から第９世代まで対応しています。

index.jsの11行目の引数を変えることで世代を変更できます。

下記は第１世代を指定した場合

``const nos = Generation.get_no(1);``
