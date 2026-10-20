#!/usr/bin/env python3
"""
Download the tool thumbnails referenced in tools.js and point tools.js at the
local copies (assets/tools/). WebP files that are already small are saved
untouched (no quality loss); anything else is converted to a 16:10 WebP.

Usage (run from the project root):
    pip3 install pillow          # once
    python3 scripts/download_images.py

Safe to re-run: files that already exist are skipped, failed downloads keep
their remote URL in tools.js.
"""
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
from pathlib import Path
from urllib.parse import urlparse

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is missing. Install it with:  pip3 install pillow")

ROOT = Path(__file__).resolve().parent.parent
TOOLS_JS = ROOT / "tools.js"
OUT_DIR = ROOT / "assets" / "tools"
SIZE = (712, 446)          # ~16:10, 2.5x the ~280 px card image
KEEP_MAX_WIDTH = 900       # WebP up to this width is kept byte-for-byte
QUALITY = 82
WORKERS = 8
UA = {"User-Agent": "Mozilla/5.0 (stacked image downloader)"}


def fetch(url):
    last = None
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except Exception as e:          # noqa: BLE001
            last = e
    raise last


def process(url):
    """Returns (url, local_path or None, error or None)."""
    name = Path(urlparse(url).path).stem + ".webp"
    dest = OUT_DIR / name
    if dest.exists():
        return url, f"assets/tools/{name}", None
    try:
        data = fetch(url)
        im = Image.open(BytesIO(data))
        if im.format == "WEBP" and im.width <= KEEP_MAX_WIDTH:
            dest.write_bytes(data)      # already small WebP – keep as is
            return url, f"assets/tools/{name}", None
        im = ImageOps.exif_transpose(im)
        im = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        im = ImageOps.fit(im, SIZE, Image.LANCZOS, centering=(0.5, 0.5))
        im.save(dest, "WEBP", quality=QUALITY, method=6)
        return url, f"assets/tools/{name}", None
    except Exception as e:              # noqa: BLE001
        return url, None, str(e)


def main():
    text = TOOLS_JS.read_text(encoding="utf-8")
    urls = sorted(set(re.findall(r'"image":\s*"(https?://[^"]+)"', text)))
    if not urls:
        print("No remote images found in tools.js – nothing to do.")
        return
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {len(urls)} images …")

    done, failed = {}, []
    with ThreadPoolExecutor(WORKERS) as pool:
        for i, (url, local, err) in enumerate(pool.map(process, urls), 1):
            if local:
                done[url] = local
            else:
                failed.append((url, err))
            if i % 50 == 0 or i == len(urls):
                print(f"  {i}/{len(urls)}")

    def swap(m):
        return f'"image": "{done.get(m.group(1), m.group(1))}"'
    text = re.sub(r'"image":\s*"(https?://[^"]+)"', swap, text)
    TOOLS_JS.write_text(text, encoding="utf-8")

    print(f"Done: {len(done)} local, {len(failed)} failed.")
    for url, err in failed[:20]:
        print("  FAILED", url, "-", err)
    if failed:
        print("Re-run the script to retry the failed ones.")


if __name__ == "__main__":
    main()
