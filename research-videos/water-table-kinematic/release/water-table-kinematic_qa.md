# Research Video QA Notes

## Exported Artifacts

- MP4: `water-table-kinematic.mp4`
- HTML player: `water-table-kinematic.html`
- Contact sheet: `water-table-kinematic_contact_sheet.png`
- Metadata: `water-table-kinematic_metadata.json`

## ffprobe Metadata

```text
codec_name=h264
profile=Constrained Baseline
width=1280
height=720
pix_fmt=yuv420p
level=31
duration=14.000000
nb_frames=420
format_name=mov,mp4,m4a,3gp,3g2,mj2
duration=14.000000
size=304169
```

## Required Manual Review

- Open the HTML player in a browser.
- Confirm the video has finite duration, positive width and height, and no media error.
- Review the contact sheet for clipped text, text/data overlap, crowded labels, and stale transition frames.
- Publish as a GitHub Release asset when the target private paper repo is known.
