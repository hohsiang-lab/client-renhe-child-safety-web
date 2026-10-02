# HO-3184 AI TTS review drafts (partial)

**Status: review-only, not production audio.** This folder is deliberately outside `public/` and is not referenced by the application. These files are not integrated, deployed, or individually approved for product use.

Norman approved the current UI/caption text at client `main` commit `9108c0a04d50183af029aef06ddcf6748114e117` verbatim as transcript sources for the remaining 23 active-path **review drafts**. Five drafts were generated through the existing Gemini `gemini-2.5-flash-preview-tts` / `Kore` route using the B voice-direction prompt. The B direction was confirmed from separate body-traffic-light samples; these five recordings have not yet received individual subjective review.

| Draft | Exact transcript | Length |
|---|---|---:|
| `home-welcome-b-review-candidate.mp3` | `一起來學習怎麼保護自己吧！` | 3.091 s |
| `ending-b-review-candidate.mp3` | `你好棒！今天學到了很多保護自己的方法！` | 4.731 s |
| `female-red-response-b-review-candidate.mp3` | `不可以摸我！` | 1.691 s |
| `male-red-response-b-review-candidate.mp3` | `不可以摸我！` | 1.691 s |
| `female-yellow-response-b-review-candidate.mp3` | `你要先問我喔！` | 1.971 s |

All five are MP3, 24 kHz, mono; metadata and full decode were verified. The next request (`male-yellow-response`) hit Gemini quota/rate limiting, so generation stopped without retry: 5/23 produced, 18 remain unproduced (the failed request plus 17 not attempted).

This PR only checks in the five review artifacts and this provenance note. It does not modify application code, active audio paths, captions, E2E tests, TTS configuration, or deployment settings. Do not treat it as app-playback, staging acceptance, formal audio approval, or child-listening evidence. No child testing was performed.
