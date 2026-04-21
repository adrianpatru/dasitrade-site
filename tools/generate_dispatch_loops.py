from __future__ import annotations

import math
from pathlib import Path

import imageio.v2 as imageio
import numpy as np
from PIL import Image, ImageEnhance, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "assets" / "img" / "dispatch"
TARGET_SIZE = (320, 200)
FPS = 12
DURATION_SECONDS = 5
FRAME_COUNT = FPS * DURATION_SECONDS

CAMERAS = [
    {
        "output": "cam-01-sediu.mp4",
        "source": ROOT / "assets" / "img" / "hero-contact.jpg",
        "zoom": (1.02, 1.12),
        "pan": ((0.52, 0.38), (0.44, 0.46)),
        "pulse_phase": 0.0,
    },
    {
        "output": "cam-02-acces.mp4",
        "source": ROOT / "assets" / "img" / "svc-06-acces.jpg",
        "zoom": (1.0, 1.1),
        "pan": ((0.45, 0.28), (0.56, 0.46)),
        "pulse_phase": 0.21,
    },
    {
        "output": "cam-03-perimetru.mp4",
        "source": ROOT / "assets" / "img" / "svc-04-efractie.jpg",
        "zoom": (1.01, 1.13),
        "pan": ((0.58, 0.42), (0.48, 0.36)),
        "pulse_phase": 0.43,
    },
    {
        "output": "cam-04-interior.mp4",
        "source": ROOT / "assets" / "img" / "port-06.jpg",
        "zoom": (1.0, 1.09),
        "pan": ((0.43, 0.32), (0.53, 0.48)),
        "pulse_phase": 0.67,
    },
]


def ease(value: float) -> float:
    return 0.5 - 0.5 * math.cos(math.pi * value)


def lerp(start: float, end: float, amount: float) -> float:
    return start + (end - start) * amount


def cover_crop(image: Image.Image, zoom: float, pan_x: float, pan_y: float) -> Image.Image:
    target_w, target_h = TARGET_SIZE
    source_w, source_h = image.size
    target_ratio = target_w / target_h
    source_ratio = source_w / source_h

    if source_ratio > target_ratio:
        full_crop_h = source_h
        full_crop_w = source_h * target_ratio
    else:
        full_crop_w = source_w
        full_crop_h = source_w / target_ratio

    crop_w = full_crop_w / zoom
    crop_h = full_crop_h / zoom

    max_left = max(source_w - crop_w, 0)
    max_top = max(source_h - crop_h, 0)
    left = max_left * pan_x
    top = max_top * pan_y
    right = left + crop_w
    bottom = top + crop_h

    cropped = image.crop((left, top, right, bottom))
    return cropped.resize(TARGET_SIZE, Image.Resampling.LANCZOS)


def stylize(frame: Image.Image, phase: float, pulse_phase: float) -> Image.Image:
    frame = ImageOps.autocontrast(frame, cutoff=1)
    frame = ImageEnhance.Color(frame).enhance(0.78)
    frame = ImageEnhance.Contrast(frame).enhance(0.96)

    brightness = 0.9 + 0.06 * math.sin(2 * math.pi * (phase * 1.2 + pulse_phase))
    frame = ImageEnhance.Brightness(frame).enhance(brightness)

    tint = Image.new("RGB", TARGET_SIZE, (10, 34, 22))
    frame = Image.blend(frame, tint, 0.18)
    return frame


def write_video(path: Path, frames: list[np.ndarray]) -> None:
    codecs = ["libx264", "mpeg4"]
    last_error: Exception | None = None

    for codec in codecs:
        try:
            with imageio.get_writer(
                path,
                fps=FPS,
                format="ffmpeg",
                codec=codec,
                macro_block_size=1,
                output_params=[
                    "-pix_fmt",
                    "yuv420p",
                    "-movflags",
                    "+faststart",
                    "-crf",
                    "30",
                    "-preset",
                    "veryfast",
                    "-an",
                ],
            ) as writer:
                for frame in frames:
                    writer.append_data(frame)
            return
        except Exception as error:  # pragma: no cover - fallback path
            last_error = error

    if last_error is not None:
        raise last_error


def render_camera(camera: dict[str, object]) -> None:
    source_path = Path(camera["source"])
    output_path = OUTPUT_DIR / str(camera["output"])
    source = Image.open(source_path).convert("RGB")
    frames: list[np.ndarray] = []

    start_zoom, end_zoom = camera["zoom"]
    (start_pan_x, start_pan_y), (end_pan_x, end_pan_y) = camera["pan"]
    pulse_phase = float(camera["pulse_phase"])

    for index in range(FRAME_COUNT):
        phase = index / (FRAME_COUNT - 1)
        motion = ease(phase)
        zoom = lerp(start_zoom, end_zoom, motion)
        pan_x = lerp(start_pan_x, end_pan_x, motion)
        pan_y = lerp(start_pan_y, end_pan_y, motion)
        frame = cover_crop(source, zoom, pan_x, pan_y)
        frame = stylize(frame, phase, pulse_phase)
        frames.append(np.asarray(frame, dtype=np.uint8))

    write_video(output_path, frames)


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    for camera in CAMERAS:
        render_camera(camera)
        print(f"generated {camera['output']}")


if __name__ == "__main__":
    main()