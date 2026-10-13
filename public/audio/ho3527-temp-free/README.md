# HO-3527 temporary synthetic option audio

Twenty exact approved option labels are integrated as static MP3 files through the existing player. These are temporary AI-generated Mandarin recordings, not human recordings or approved Taiwan-accent performances. Gemini uniform regeneration is deferred per the owner decision recorded in Linear comment b0cd3a1b-196e-4d58-850a-02f8a94d6924.

Generation: local CPU, Kokoro 0.9.4 / hexgrad/Kokoro-82M-v1.1-zh, voice zf_001, speed 0.95; no paid account or generation service. Model/voice revisions and checksums are in model-provenance.json; upstream Apache-2.0 model card and tool license are retained here. Unlike the rejected Piper Huayan candidate (dataset license unknown), Kokoro's model card explicitly declares Apache-2.0 and freely/permissively granted Chinese data. Assets can be distributed; no inference dependency is shipped or used at runtime.

manifest.json preserves each identifier, verbatim transcript, phonemes, provider/tool/model/voice/license/source/output, SHA256, duration and full ffmpeg decode result. Mapping source: Linear comment 28660280-e16e-4fa7-9b03-d4d3d2bef712 and existing route/tests. Hotline transcript remains `113`; its pronunciation is explicitly three digits 一、一、三 rather than 一百一十三. The initial generated version and superseding receipt remain outside the repo in task-owned free-audio-t_f083d328, unmodified.

Check all integrated assets: `python scripts/check_ho3527_audio.py` (ffmpeg required). Browser checks: `npx playwright test e2e/trusted-adult.spec.ts e2e/trusted-adult-media.spec.ts --project=chromium`. The first file uses ImmediateAudio for deterministic timing; the media file observes actual HTMLAudioElement playback, without replacing media decoding/playback. Use HO3527_SCREENSHOTS to direct screenshots to a distinct evidence directory.

Existing Gemini candidates/immutable receipts and prior screenshots/test-results remain untouched. Human listening preference, independent review, hosted CI, publication/merge and staging evidence are separate gates; technical decode/playback is not a claim of child listening acceptance.
