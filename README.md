# PokemonSoundsQuiz
Amazon Alexaスキルでポケモン鳴き声クイズを作成できます。

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
### Alexa Developer Consoleでスキルを作成
https://developer.amazon.com/ja-JP/alexa/alexa-skills-kit#

### 作成途中にある「スキルをインポート」ボタンを押して本レポジトリを読み込む
https://github.com/Eito-H/PokemonSoundsQuiz.git

### スキルの呼び出し名を設定してビルド

### 音声ファイルの作成
ポケモンの鳴き声ファイルは著作権の関係上ご自身でご用意ください。


(参考)ポケモンGOの鳴き声ファイル

https://github.com/PokeMiners/pogo_assets/tree/master/Sounds/Pokemon%20Cries

※Alexa skillではwavの再生に対応していないためmp3変換する必要あり

## 対象ポケモンの世代を変更する場合
index.jsの11行目の引数を変えることで世代を変更できます。

第１世代から第９世代まで対応しています。

下記は第１世代を指定した場合

``const nos = Generation.get_no(1);``
