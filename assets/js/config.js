/*
 * サイト全体の設定ファイル
 * ------------------------------------------------------------
 * ページの順番・テンプレートのURL・スクリーンショットなど、
 * 「後から変わる可能性があるもの」はすべてここにまとめています。
 * 更新方法は README.md を参照してください。
 */
window.SITE_CONFIG = {
  siteName: "ClaudeとGitHubではじめる小説管理",

  /*
   * 小説管理テンプレートリポジトリのURL
   * まだ公開URLが確定していないため空欄にしています。
   * 確定したら "https://github.com/（ユーザー名）/（リポジトリ名）" の形で入力してください。
   * 空欄のあいだは、サイト上に「準備中」と表示されます。
   */
  templateRepoUrl: "https://github.com/zonarouzo/NovelTemplate",

  /* 外部リンク（公式サイト） */
  links: {
    github: "https://github.com/",
    githubSignup: "https://github.com/signup",
    githubSecuritySettings: "https://github.com/settings/security",
    githubEmailSettings: "https://github.com/settings/emails",
    claudeCode: "https://claude.ai/code",
    claudeGithubApp: "https://github.com/apps/claude/installations/new",
    githubDocs2fa: "https://docs.github.com/ja/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication",
    githubDocsTemplate: "https://docs.github.com/ja/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template",
    githubDocsPlans: "https://docs.github.com/ja/get-started/learning-about-github/githubs-plans",
    claudeCodeWebDocs: "https://code.claude.com/docs/en/web-quickstart",
    claudeCodeWebDetail: "https://code.claude.com/docs/en/claude-code-on-the-web"
  },

  /*
   * ページの順番
   * step: true のページは「ステップ」として進行状況（○/5）に数えます。
   * 並べ替えると、メニュー・前へ/次へ・進行状況が自動で変わります。
   */
  pages: [
    { file: "index.html",             title: "トップ",                 short: "トップ" },
    { file: "github-account.html",    title: "GitHubアカウントの作成",   short: "アカウント作成", step: true },
    { file: "create-repository.html", title: "小説管理リポジトリの作成", short: "保管場所の作成", step: true },
    { file: "claude-code.html",       title: "Claude Codeとの連携",     short: "Claude Code連携", step: true },
    { file: "initial-setup.html",     title: "小説の初期設定",           short: "初期設定",       step: true },
    { file: "writing.html",           title: "小説の執筆と管理",         short: "執筆と管理",     step: true },
    { file: "prompts.html",           title: "プロンプト集",             short: "プロンプト集" },
    { file: "faq.html",               title: "よくある質問・トラブル解決", short: "FAQ・トラブル" }
  ],

  /*
   * スクリーンショット
   * HTML内の <figure class="shot" data-shot="ID"> に対応します。
   * 実際の操作で確認できた画像だけを assets/images/screenshots/ に置き、
   * ここに "ID": "ファイル名" を追加してください。
   * 登録がないIDは「画像準備中」の枠が表示されます。
   * 例： "github-signup": "github-signup.png"
   */
  screenshots: {
    "template-use-button": "template-use-button.png",
    "template-create-form": "template-create-form.png",
    "claude-code-repo-select": "claude-code-repo-select.png",
    "github-app-install": "github-app-install.png"
  },

  /*
   * 画像がまだない枠（画像準備中）を表示するかどうか
   * false：画像が登録されていない枠は表示しない（公開サイト向け。画像がなくても読めるように本文を書いています）
   * true ：「画像準備中」の枠を表示する（どこに画像が入るかを確認したいとき）
   */
  showScreenshotPlaceholders: false
};
