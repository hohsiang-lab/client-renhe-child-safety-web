# HO-3184 AI audio integration

These 23 MP3s are AI-generated Taiwanese Mandarin using the existing Gemini free-tier route, gemini-2.5-flash-preview-tts / Kore and approved B direction. They are not human recordings.

Approved transcript sources are the existing UI/captions at 9108c0a04d50183af029aef06ddcf6748114e117; app captions and paths are unchanged. The three existing body-traffic-light files are separate and unchanged. Inactive legacy files, including trust-q5-wrong.mp3, are not part of this integration.

Sources: retained specs/HO-3184-ai-tts-review-drafts (13 clips), authorized immutable recovery run893 (7 clips), and run1012 (3 clips). Durable generation manifests, exact transcripts, source mapping, SHA256, MP3 metadata and full-decode receipts live under coder exports/ho3184-recovery-run893 and ho3184-recovery-run1012. All 23 source-to-public copies were hash-verified; MP3/24kHz/mono and full decode passed.

Trusted Adult correct-feedback progression uses the existing playback completion/error callback instead of a fixed timer, so the longer q5 explanation can finish. Muting does not skip playback or remove text/icon feedback; existing replay and captions remain.

Integration is authorized before final delivery confirmation. File integrity is not spoken-word/listening acceptance. Exact-head review, hosted CI and staging playback are separate gates. Final project/customer listening and transcript confirmation, consented three-child blind-listening (at most one robotic rating), and HO-615 UAT remain unfinished. Do not mark HO-3184 Done from this PR.
