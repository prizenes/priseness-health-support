#!/usr/bin/env python3
"""公開前チェック。問題があれば一覧を出して終了コード1で止まる（その記事は公開しない）。

使い方: python3 content/check_site.py
"""
import glob, html, json, os, re, sys
import xml.dom.minidom

BASE = "https://priseness-health-support.vercel.app"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

BANNED = ["治る", "完治", "治します", "改善します", "必ず防", "確実に防", "再発しない",
          "効果を保証", "一番選ばれ", "監修"]
errors = []


def err(f, msg):
    errors.append(f"{f}: {msg}")


def read(f):
    return open(f, encoding="utf-8-sig").read()


def text_of(fragment):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", fragment))).strip()


def route_exists(path):
    path = path.split("#")[0].split("?")[0]
    if path in ("", "/"):
        return os.path.exists("index.html")
    p = path.strip("/")
    return any(os.path.exists(c) for c in (p, p + ".html", os.path.join(p, "index.html")))


def ld_blocks(f, s):
    out = []
    for b in re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
        try:
            out.append(json.loads(b))
        except Exception as e:  # noqa
            err(f, f"構造化データがJSONとして読めない: {e}")
    return out


pages = sorted(glob.glob("*.html")) + sorted(glob.glob("blog/*.html"))
articles = [f for f in sorted(glob.glob("blog/*.html")) if not f.endswith("index.html")]

# 全ページ共通
for f in pages:
    s = read(f)
    blocks = ld_blocks(f, s)
    if f != "404.html":
        if len(re.findall(r"<h1[ >]", s)) != 1:
            err(f, "h1が1つではない")
        if 'rel="canonical"' not in s:
            err(f, "canonicalがない")
        if 'name="robots" content="noindex' in s:
            err(f, "公開ページにnoindexが付いている")
    for href in set(re.findall(r'href="(/[^"]*)"', s)):
        if href.startswith("/_vercel"):
            continue
        if not route_exists(href):
            err(f, f"内部リンク切れ: {href}")
    for src in re.findall(r'<img[^>]+src="([^"]+)"', s):
        if src.startswith("http"):
            continue
        p = src.lstrip("/") if src.startswith("/") else os.path.normpath(os.path.join(os.path.dirname(f), src))
        if not os.path.exists(p):
            err(f, f"画像がない: {src}")
    for tag in re.findall(r"<img [^>]*>", s):
        if "alt=" not in tag:
            err(f, f"altがない: {tag[:60]}")
        if "width=" not in tag or "height=" not in tag:
            err(f, f"width/heightがない: {tag[:60]}")

# 記事ページ
for f in articles:
    s = read(f)
    slug = os.path.basename(f)[:-5]
    url = f"{BASE}/blog/{slug}"
    if not re.fullmatch(r"[a-z0-9-]+", slug):
        err(f, "slugは英小文字・数字・ハイフンのみ")
    m = re.search(r'rel="canonical" href="([^"]+)"', s)
    if not m or m.group(1) != url:
        err(f, f"canonicalが正しくない（期待値 {url}）")
    if f'property="og:url" content="{url}"' not in s:
        err(f, "og:urlが正しくない")
    for need in ('name="description"', 'property="og:title"', 'property="og:image"', "G-EWVE5W7WNE",
                 'class="breadcrumb"', "公開日", 'class="article-note"'):
        if need not in s:
            err(f, f"必須要素がない: {need}")
    blocks = ld_blocks(f, s)
    types = [b.get("@type") for b in blocks]
    for t in ("FAQPage", "BreadcrumbList"):
        if t not in types:
            err(f, f"構造化データ {t} がない")
    if not ({"Article", "BlogPosting"} & set(types)):
        err(f, "構造化データ Article/BlogPosting がない")
    visible = [(text_of(q), text_of(a)) for q, a in
               re.findall(r"<details>\s*<summary>(.*?)</summary>\s*<p>(.*?)</p>\s*</details>", s, re.S)]
    faq = next((b for b in blocks if b.get("@type") == "FAQPage"), None)
    if faq:
        schema = [(q["name"].strip(), q["acceptedAnswer"]["text"].strip()) for q in faq["mainEntity"]]
        if schema != visible:
            err(f, f"FAQの表示と構造化データが一致しない（表示{len(visible)}問 / 構造化{len(schema)}問）")
    body = s[s.find("<main"):]
    for w in BANNED:
        if w in body:
            err(f, f"使わない表現が含まれている: 「{w}」")
    # 新しい記事（AI作成ルール適用後）は出典リンク必須
    if 'class="article-note"' in s and not re.search(r'class="source-note".*?href="https?://', s, re.S):
        err(f, "出典リンクがない")
    for t in ("Article", "BlogPosting"):
        art = next((b for b in blocks if b.get("@type") == t), None)
        if art and art.get("mainEntityOfPage") not in (url, {"@id": url}):
            err(f, "Article.mainEntityOfPage がURLと一致しない")

# 一覧・トップ・サイトマップ
bi = read("blog/index.html")
for f in articles:
    slug = os.path.basename(f)[:-5]
    if f'href="/blog/{slug}"' not in bi:
        err("blog/index.html", f"一覧に記事がない: {slug}")
    if f"{BASE}/blog/{slug}" not in bi:
        err("blog/index.html", f"ItemListに記事がない: {slug}")

top = read("index.html")
grid = top[top.find('<div class="news-grid">'):]
grid = grid[:grid.find("</section>")]
cards = re.findall(r'<a href="/blog/([a-z0-9-]+)">記事を読む</a>', grid)
if len(cards) != 3:
    err("index.html", f"新着情報のカードが3件ではない（{len(cards)}件）")

try:
    doc = xml.dom.minidom.parse("sitemap.xml")
    locs = [n.firstChild.data.strip() for n in doc.getElementsByTagName("loc")]
    if len(locs) != len(set(locs)):
        err("sitemap.xml", "URLが重複している")
    for f in articles:
        u = f"{BASE}/blog/{os.path.basename(f)[:-5]}"
        if u not in locs:
            err("sitemap.xml", f"記事URLがない: {u}")
except Exception as e:  # noqa
    err("sitemap.xml", f"XMLとして読めない: {e}")

if errors:
    print("NG: 公開を止めます")
    for e in errors:
        print(" -", e)
    sys.exit(1)
print(f"OK: {len(pages)}ページ / 記事{len(articles)}本をチェックしました")
