# ClaudeとGitHubではじめる小説管理

GitHub とブラウザ版 Claude Code を使って、小説の原稿・プロット・設定資料を管理する方法を、GitHub 未経験者向けに解説する HowTo サイトです。
GitHub Pages で公開することを前提に、HTML / CSS / JavaScript だけで作っています（ビルド不要・外部サービス不要）。

## ページ構成

| ファイル | ページ | 種類 |
|---|---|---|
| `index.html` | トップ | — |
| `github-account.html` | GitHubアカウントの作成 | ステップ1 |
| `create-repository.html` | 小説管理リポジトリの作成 | ステップ2 |
| `claude-code.html` | Claude Codeとの連携 | ステップ3 |
| `initial-setup.html` | 小説の初期設定 | ステップ4 |
| `writing.html` | 小説の執筆と管理 | ステップ5 |
| `prompts.html` | プロンプト集 | 資料 |
| `faq.html` | よくある質問・トラブル解決 | 資料 |
| `404.html` | ページが見つからないとき | — |

## ファイル構成

```
├── index.html ほか各ページ（.html）
├── 404.html
├── favicon.svg
├── .nojekyll                 … GitHub Pages で Jekyll の変換を行わないための空ファイル
└── assets/
    ├── css/style.css         … デザイン（色は先頭の :root で一括管理）
    ├── js/config.js          … ★サイトの設定（ページ順・テンプレートURL・外部リンク・スクリーンショット）
    ├── js/prompts.js         … ★プロンプトの文面（コピー用の指示文はすべてここ）
    ├── js/main.js            … メニュー・進行状況・前へ/次へ・コピーボタンなどの動き
    └── images/screenshots/   … 画面画像の置き場所
```

各ページの HTML には本文だけが書かれていて、ヘッダー・メニュー・進行状況・前へ/次へ・フッターは `main.js` が `config.js` の設定から自動で表示します。

## よくある更新のしかた

### テンプレートリポジトリのURLが決まったら

`assets/js/config.js` の `templateRepoUrl` に URL を入れます。

```js
templateRepoUrl: "https://github.com/（ユーザー名）/（リポジトリ名）",
```

空欄のあいだは、ステップ2のページに「準備中」と表示されます。URL を入れると「テンプレートのページを開く」ボタンに変わります。

### プロンプトの文面を変えたい・追加したい

`assets/js/prompts.js` を編集します。

- 既存の文面を変える：該当する `id` の `text` を書き換える（全ページに反映されます）
- 新しく追加する：`window.PROMPTS` に `{ id, category, title, text, note }` を追加する
  - 「プロンプト集」ページには自動で表示されます
  - ほかのページに載せたいときは、HTML に `<div data-prompt="追加したid"></div>` と書きます
- 分類を増やす：`window.PROMPT_CATEGORIES` に追加します

本文中に1回だけ使うコピー用の文章は、HTML に `<pre class="copyable" data-title="見出し">文章</pre>` と書くとコピーボタンが付きます。

### スクリーンショットを追加したい

**実際の操作で確認できた画像だけ**を使ってください。

1. 画像を `assets/images/screenshots/` に置く
2. `assets/js/config.js` の `screenshots` に `"ID": "ファイル名"` を追加する

```js
screenshots: {
  "github-signup": "github-signup.png"
}
```

登録のない ID は「画像準備中」の枠で表示されます。現在用意している枠は次のとおりです。

| ID | ページ | 内容 |
|---|---|---|
| `github-signup` | アカウント作成 | GitHub の登録ページ |
| `github-signup-code` | アカウント作成 | メールで届いた確認コードを入力する画面 |
| `github-email-verify` | アカウント作成 | メール設定の画面（確認メールの再送） |
| `github-2fa-enable` | アカウント作成 | 二段階認証を有効にするボタン |
| `template-use-button` | リポジトリ作成 | 「Use this template」ボタン |
| `template-create-form` | リポジトリ作成 | 名前の入力と「Private」の選択 |
| `repo-created` | リポジトリ作成 | 作成したリポジトリのページ |
| `claude-code-top` | Claude Code連携 | Claude Code の最初の画面 |
| `github-authorize` | Claude Code連携 | GitHub の許可の画面 |
| `github-app-install` | Claude Code連携 | Claude GitHub App のインストール画面 |
| `claude-code-repo-select` | Claude Code連携 | リポジトリを選ぶ画面 |
| `initial-prompt-sent` | 初期設定 | 初回プロンプトを送信したところ |
| `github-file-history` | 執筆と管理 | ファイルの変更履歴 |
| `claude-code-create-pr` | 執筆と管理 | Claude Code の「Create PR」ボタン |
| `github-merge-pr` | 執筆と管理 | GitHub の「Merge pull request」ボタン |

新しい枠を作るときは、HTML に `<figure class="shot" data-shot="新しいID" data-caption="説明"></figure>` と書きます。

### ページを追加・並べ替えたい

1. 既存のページ（例：`faq.html`）をコピーして、`<article>` の中身を書き換える
2. `assets/js/config.js` の `pages` に追加する（並び順＝メニュー・前へ/次への順番）
3. 手順として数えるページは `step: true` を付ける（進行状況「○ / 5」に反映されます）

### 本文を直したい

各 HTML ファイルの `<!-- ===== ここから本文 ===== -->` と `<!-- ===== ここまで本文 ===== -->` のあいだを編集します。
よく使う部品：

- 手順：`<ol class="steps"><li><p>…</p></li></ol>`
- 注意書き：`<div class="callout">`（情報）、`callout-tip`（ヒント）、`callout-warn`（注意）、`callout-pending`（準備中・未確定）
- 画面のボタン名：`<span class="ui">Settings</span>`
- 公式サイトへのリンク：`<a data-link="キー" href="URL">`（URL は `config.js` の `links` で一括管理）

## 未確定・準備中の内容

次の内容は未確定のため、サイト上で「準備中」「暫定」と明記しています。確定したら更新してください。

- **テンプレートリポジトリのURL**：`config.js` の `templateRepoUrl`（現在は空欄）
- **main への自動反映**：未検証。現在は「Create PR → Merge pull request」の暫定手順を `writing.html#save` に掲載
- **初回プロンプト**：テンプレートの最終仕様に合わせて `prompts.js` の `initial-setup` を調整
- **スクリーンショット**：すべて「画像準備中」

## 内容の根拠

説明は、執筆時点（2026年11月）で確認できた次の公式情報にもとづいています。画面や機能は変わることがあるため、更新時には再確認してください。

- GitHub Docs（アカウント作成の流れ、メールアドレスの確認、二段階認証、プラン、テンプレートからのリポジトリ作成、GitHub Pages の公開設定）
- Claude Code Docs（[web-quickstart](https://code.claude.com/docs/en/web-quickstart)、[Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)）

## ローカルでの確認方法

ビルドは不要です。HTML ファイルをブラウザで直接開くだけでも表示できます。
（コピーボタンは、`https://` で公開されたページでいちばん確実に動作します。）

## GitHub Pages での公開設定

1. リポジトリの **Settings** を開く
2. 左のメニューの **Pages** を開く
3. 「Build and deployment」の「Source」で **Deploy from a branch** を選ぶ
4. ブランチで **main**、フォルダで **/ (root)** を選び、**Save** を押す
5. 数分後、ページ上部に表示される URL（`https://ユーザー名.github.io/リポジトリ名/`）で公開されます
