# Research Video QA Notes

## Exported Artifacts

- MP4: `transient-vertical-flux.mp4`
- HTML player: `transient-vertical-flux.html`
- Contact sheet: `transient-vertical-flux_contact_sheet.png`
- Metadata: `transient-vertical-flux_metadata.json`

## ffprobe Metadata

```text
codec_name=h264
profile=Constrained Baseline
width=1280
height=720
pix_fmt=yuv420p
level=31
duration=10.500000
nb_frames=315
format_name=mov,mp4,m4a,3gp,3g2,mj2
duration=10.500000
size=286436
```

## Required Manual Review

- Open the HTML player in a browser.
- Confirm the video has finite duration, positive width and height, and no media error.
- Review the contact sheet for clipped text, text/data overlap, crowded labels, and stale transition frames.
- Publish as a GitHub Release asset when the target private paper repo is known.
