from __future__ import annotations

import argparse
import re
from pathlib import Path

try:
    import pymupdf as fitz
except ImportError:
    import fitz


def slugify(value: str) -> str:
    slug = value.lower()
    slug = slug.replace("&", " and ")
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    return slug.strip("-")


def render_first_page(pdf_path: Path, output_path: Path, width: int) -> None:
    with fitz.open(pdf_path) as document:
        if document.page_count == 0:
            raise ValueError(f"{pdf_path} has no pages")

        page = document.load_page(0)
        rect = page.rect
        scale = width / rect.width
        pixmap = page.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=False)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        pixmap.save(output_path)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate first-page PNG thumbnails for poster PDFs."
    )
    parser.add_argument(
        "--source",
        default="docs/poster",
        type=Path,
        help="Directory containing PDF files.",
    )
    parser.add_argument(
        "--output",
        default="img/poster/previews",
        type=Path,
        help="Directory where PNG thumbnails will be written.",
    )
    parser.add_argument(
        "--width",
        default=1200,
        type=int,
        help="Output thumbnail width in pixels.",
    )
    args = parser.parse_args()

    pdf_paths = sorted(args.source.glob("*.pdf"), key=lambda path: path.name.lower())
    if not pdf_paths:
        raise SystemExit(f"No PDFs found in {args.source}")

    for pdf_path in pdf_paths:
        output_path = args.output / f"{slugify(pdf_path.stem)}.png"
        render_first_page(pdf_path, output_path, args.width)
        print(f"{pdf_path} -> {output_path}")


if __name__ == "__main__":
    main()
