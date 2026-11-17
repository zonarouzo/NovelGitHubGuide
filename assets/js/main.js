/*
 * サイト共通の動き
 * ------------------------------------------------------------
 * ・ヘッダー/メニュー、進行状況、前へ/次へ、フッターの表示
 * ・プロンプトの表示とコピーボタン
 * ・スクリーンショット枠（画像準備中）の表示
 * ・テンプレートURLの差し込み
 * ・「このステップを完了した」チェック（ブラウザ内にだけ保存）
 * 設定は config.js、プロンプトの文面は prompts.js にあります。
 */
(function () {
  "use strict";

  var CONFIG = window.SITE_CONFIG || { pages: [], links: {}, screenshots: {} };
  var PAGES = CONFIG.pages || [];
  var STEPS = PAGES.filter(function (p) { return p.step; });
  var STORAGE_PREFIX = "novel-guide-done:";

  /* ---------- 小さな道具 ---------- */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "text") node.textContent = attrs[k];
        else if (k === "html") node.innerHTML = attrs[k];
        else if (k === "className") node.className = attrs[k];
        else node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try {
      if (value === null) window.localStorage.removeItem(key);
      else window.localStorage.setItem(key, value);
    } catch (e) { /* 保存できない環境では何もしない */ }
  }
  function isDone(file) { return storageGet(STORAGE_PREFIX + file) === "1"; }

  function currentFile() {
    var path = window.location.pathname;
    var last = path.substring(path.lastIndexOf("/") + 1);
    if (!last) return "index.html";
    if (last.indexOf(".") === -1) last += ".html";
    return last;
  }

  var CURRENT = currentFile();
  var CURRENT_INDEX = PAGES.findIndex(function (p) { return p.file === CURRENT; });
  var CURRENT_PAGE = PAGES[CURRENT_INDEX];

  /* ---------- ヘッダーとメニュー ---------- */
  function renderHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    header.innerHTML = "";

    var brand = el("a", { href: "index.html", className: "brand" }, [
      el("span", { className: "brand-mark", "aria-hidden": "true", text: "✎" }),
      el("span", { className: "brand-name", text: CONFIG.siteName })
    ]);

    var toggle = el("button", {
      type: "button", className: "menu-toggle",
      "aria-expanded": "false", "aria-controls": "site-nav"
    }, [el("span", { text: "メニュー" })]);

    var list = el("ol", { className: "nav-list" });
    var stepNo = 0;
    PAGES.forEach(function (p) {
      var label = p.short || p.title;
      var prefix = "";
      if (p.step) { stepNo += 1; prefix = stepNo + ". "; }
      var a = el("a", { href: p.file, text: prefix + label });
      if (p.file === CURRENT) a.setAttribute("aria-current", "page");
      if (p.step && isDone(p.file)) a.appendChild(el("span", { className: "nav-done", "aria-label": "完了", text: "✓" }));
      list.appendChild(el("li", { className: p.step ? "is-step" : "" }, [a]));
    });
    var nav = el("nav", { id: "site-nav", className: "site-nav", "aria-label": "サイト内メニュー" }, [list]);

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", open ? "false" : "true");
      nav.classList.toggle("is-open", !open);
    });

    header.appendChild(el("div", { className: "header-inner" }, [brand, toggle]));
    header.appendChild(nav);
  }

  /* ---------- 進行状況（ステップのページ） ---------- */
  function renderProgress() {
    var box = document.getElementById("progress");
    if (!box) return;
    var idx = STEPS.findIndex(function (p) { return p.file === CURRENT; });
    box.innerHTML = "";

    var doneCount = STEPS.filter(function (p) { return isDone(p.file); }).length;
    if (idx === -1) {
      // ステップ以外のページでは、全体の完了数だけを表示
      box.appendChild(el("p", { className: "progress-label",
        text: "準備の進み具合：" + doneCount + " / " + STEPS.length + " ステップ完了" }));
    } else {
      box.appendChild(el("p", { className: "progress-label" }, [
        el("strong", { text: "ステップ " + (idx + 1) + " / " + STEPS.length }),
        document.createTextNode("　" + STEPS[idx].title)
      ]));
    }

    var dots = el("ol", { className: "progress-steps", "aria-label": "ステップ一覧" });
    STEPS.forEach(function (p, i) {
      var cls = "progress-step";
      if (i === idx) cls += " is-current";
      if (isDone(p.file)) cls += " is-done";
      var a = el("a", { href: p.file, title: p.title }, [
        el("span", { className: "dot", text: isDone(p.file) ? "✓" : String(i + 1) }),
        el("span", { className: "step-name", text: p.short || p.title })
      ]);
      if (i === idx) a.setAttribute("aria-current", "step");
      dots.appendChild(el("li", { className: cls }, [a]));
    });
    box.appendChild(dots);
  }

  /* ---------- 前へ・次へ ---------- */
  function renderPager() {
    var box = document.getElementById("pager");
    if (!box || CURRENT_INDEX === -1) return;
    box.innerHTML = "";
    var prev = PAGES[CURRENT_INDEX - 1];
    var next = PAGES[CURRENT_INDEX + 1];
    if (prev) {
      box.appendChild(el("a", { href: prev.file, className: "pager-link pager-prev", rel: "prev" }, [
        el("span", { className: "pager-dir", text: "← 前へ" }),
        el("span", { className: "pager-title", text: prev.title })
      ]));
    } else {
      box.appendChild(el("span"));
    }
    if (next) {
      box.appendChild(el("a", { href: next.file, className: "pager-link pager-next", rel: "next" }, [
        el("span", { className: "pager-dir", text: "次へ →" }),
        el("span", { className: "pager-title", text: next.title })
      ]));
    }
  }

  /* ---------- 「このステップを完了した」 ---------- */
  function renderDoneBox() {
    var box = document.getElementById("step-done");
    if (!box || !CURRENT_PAGE || !CURRENT_PAGE.step) return;
    box.innerHTML = "";
    var id = "done-check";
    var input = el("input", { type: "checkbox", id: id });
    input.checked = isDone(CURRENT);
    input.addEventListener("change", function () {
      storageSet(STORAGE_PREFIX + CURRENT, input.checked ? "1" : null);
      renderHeader();
      renderProgress();
    });
    box.appendChild(el("label", { "for": id, className: "done-label" }, [
      input,
      el("span", { text: "このページの手順を完了した" })
    ]));
    box.appendChild(el("p", { className: "done-note",
      text: "チェックは、このブラウザの中だけに記録されます（GitHubやClaudeには送られません）。" }));
  }

  /* ---------- トップページのチェックリスト ---------- */
  function renderChecklist() {
    var box = document.getElementById("step-checklist");
    if (!box) return;
    box.innerHTML = "";
    var nextFound = false;
    STEPS.forEach(function (p, i) {
      var done = isDone(p.file);
      var cls = "checklist-item" + (done ? " is-done" : "");
      var badge = done ? "完了" : (!nextFound ? "次はここ" : "");
      if (!done && !nextFound) { nextFound = true; cls += " is-next"; }
      var a = el("a", { href: p.file }, [
        el("span", { className: "check-no", text: done ? "✓" : String(i + 1) }),
        el("span", { className: "check-title", text: p.title }),
        badge ? el("span", { className: "check-badge", text: badge }) : null
      ]);
      box.appendChild(el("li", { className: cls }, [a]));
    });
  }

  /* ---------- コピー ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = el("textarea", { readonly: "", "aria-hidden": "true" });
      ta.value = text;
      ta.style.position = "fixed"; ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); }
      catch (e) { reject(e); }
      document.body.removeChild(ta);
    });
  }

  function makeCopyButton(getText) {
    var btn = el("button", { type: "button", className: "copy-btn" }, [el("span", { text: "コピー" })]);
    btn.addEventListener("click", function () {
      copyText(getText()).then(function () {
        btn.classList.add("is-copied");
        btn.firstChild.textContent = "コピーしました";
        setTimeout(function () {
          btn.classList.remove("is-copied");
          btn.firstChild.textContent = "コピー";
        }, 2000);
      }, function () {
        btn.firstChild.textContent = "コピーできませんでした。文章を選んでコピーしてください";
      });
    });
    return btn;
  }

  function buildPromptBox(p) {
    var pre = el("pre", { className: "prompt-text", tabindex: "0" });
    pre.textContent = p.text;
    var head = el("div", { className: "prompt-head" }, [
      el("span", { className: "prompt-title", text: p.title }),
      makeCopyButton(function () { return p.text; })
    ]);
    var children = [head, pre];
    if (p.note) children.push(el("p", { className: "prompt-note", text: "💡 " + p.note }));
    return el("div", { className: "prompt-box", id: "prompt-" + p.id }, children);
  }

  function renderPrompts() {
    var list = window.PROMPTS || [];
    var byId = {};
    list.forEach(function (p) { byId[p.id] = p; });
    document.querySelectorAll("[data-prompt]").forEach(function (slot) {
      var p = byId[slot.getAttribute("data-prompt")];
      slot.innerHTML = "";
      if (!p) {
        slot.appendChild(el("p", { className: "callout callout-pending",
          text: "このプロンプトは準備中です（ID: " + slot.getAttribute("data-prompt") + "）" }));
        return;
      }
      slot.appendChild(buildPromptBox(p));
    });

    // 本文中の <pre class="copyable"> にもコピーボタンを付ける
    document.querySelectorAll("pre.copyable").forEach(function (pre) {
      if (pre.dataset.ready) return;
      pre.dataset.ready = "1";
      var wrap = el("div", { className: "prompt-box" });
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(el("div", { className: "prompt-head" }, [
        el("span", { className: "prompt-title", text: pre.getAttribute("data-title") || "コピー用テキスト" }),
        makeCopyButton(function () { return pre.textContent; })
      ]));
      pre.classList.add("prompt-text");
      wrap.appendChild(pre);
    });
  }

  /* ---------- プロンプト集ページ ---------- */
  function renderCatalog() {
    var box = document.getElementById("prompt-catalog");
    if (!box) return;
    var cats = window.PROMPT_CATEGORIES || [];
    var list = window.PROMPTS || [];
    box.innerHTML = "";

    var filter = el("div", { className: "filter", role: "group", "aria-label": "分類で絞り込む" });
    var sections = [];
    function select(catId) {
      filter.querySelectorAll("button").forEach(function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-cat") === catId ? "true" : "false");
      });
      sections.forEach(function (s) {
        s.hidden = !(catId === "all" || s.getAttribute("data-cat") === catId);
      });
    }
    [{ id: "all", name: "すべて" }].concat(cats).forEach(function (c) {
      var b = el("button", { type: "button", "data-cat": c.id, "aria-pressed": c.id === "all" ? "true" : "false", text: c.name });
      b.addEventListener("click", function () { select(c.id); });
      filter.appendChild(b);
    });
    box.appendChild(filter);

    cats.forEach(function (c) {
      var items = list.filter(function (p) { return p.category === c.id; });
      if (!items.length) return;
      var sec = el("section", { className: "catalog-section", "data-cat": c.id, id: "cat-" + c.id }, [
        el("h2", { text: c.name })
      ]);
      items.forEach(function (p) { sec.appendChild(buildPromptBox(p)); });
      sections.push(sec);
      box.appendChild(sec);
    });
  }

  /* ---------- スクリーンショット枠 ---------- */
  function renderShots() {
    var shots = CONFIG.screenshots || {};
    document.querySelectorAll("figure.shot[data-shot]").forEach(function (fig) {
      var id = fig.getAttribute("data-shot");
      var caption = fig.getAttribute("data-caption") || "";
      fig.innerHTML = "";
      if (shots[id]) {
        fig.appendChild(el("img", {
          src: "assets/images/screenshots/" + shots[id],
          alt: caption, loading: "lazy"
        }));
      } else if (!CONFIG.showScreenshotPlaceholders) {
        fig.hidden = true;
        return;
      } else {
        fig.classList.add("is-placeholder");
        fig.appendChild(el("div", { className: "shot-placeholder" }, [
          el("span", { className: "shot-icon", "aria-hidden": "true", text: "🖼" }),
          el("span", { className: "shot-label", text: "画像準備中" }),
          el("span", { className: "shot-id", text: "（" + id + "）" })
        ]));
      }
      if (caption) fig.appendChild(el("figcaption", { text: caption }));
    });
  }

  /* ---------- テンプレートURL・外部リンク ---------- */
  function renderLinks() {
    var links = CONFIG.links || {};
    document.querySelectorAll("a[data-link]").forEach(function (a) {
      var url = links[a.getAttribute("data-link")];
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });

    var url = (CONFIG.templateRepoUrl || "").trim();
    document.querySelectorAll("[data-template-link]").forEach(function (slot) {
      slot.innerHTML = "";
      if (url) {
        slot.appendChild(el("a", { href: url, className: "button", target: "_blank", rel: "noopener",
          text: "テンプレートのページを開く ↗" }));
        slot.appendChild(el("p", { className: "small", text: url }));
      } else {
        slot.appendChild(el("div", { className: "callout callout-pending" }, [
          el("p", { className: "callout-title", text: "🛠 準備中" }),
          el("p", { text: "小説管理テンプレートは現在準備中です。公開されしだい、ここにテンプレートのページへのボタンが表示されます。" })
        ]));
      }
    });
  }

  /* ---------- フッター ---------- */
  function renderFooter() {
    var footer = document.getElementById("site-footer");
    if (!footer) return;
    footer.innerHTML = "";
    footer.appendChild(el("div", { className: "footer-inner" }, [
      el("p", { text: CONFIG.siteName }),
      el("p", { className: "small", text: "このサイトは非公式の解説です。GitHub・Claude の画面や機能は変わることがあります。最新の情報は各公式サイトをご確認ください。" })
    ]));
  }

  function init() {
    renderHeader();
    renderProgress();
    renderPager();
    renderDoneBox();
    renderChecklist();
    renderPrompts();
    renderCatalog();
    renderShots();
    renderLinks();
    renderFooter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
