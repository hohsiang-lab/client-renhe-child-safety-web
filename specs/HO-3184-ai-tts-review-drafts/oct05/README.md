# HO-3184：10/05 AI 配音審聽草稿

僅供 review，尚未正式核准，未整合 app；此目錄位於 public 之外。Gemini `gemini-2.5-flash-preview-tts` / `Kore`；B 聲線方向提示僅在生成程序中套用。文字沿用核准 source `9108c0a04d50183af029aef06ddcf6748114e117`。

- `trust-q3-correct-b-review-candidate.mp3`：答對了！好棒！
  - 2.770958 秒；11564 bytes；SHA-256 `82998811a2b306d65adca2851b0862052a641e4de0b625d6b29189a3ae3f7e7a`
- `trust-q3-wrong-b-review-candidate.mp3`：再想想看喔～讓你害怕的秘密可以告訴一位你覺得安全、願意聽你說的大人；如果第一位沒有幫助，繼續告訴下一位。
  - 12.650958 秒；51116 bytes；SHA-256 `3a9ab1541585b7a5f272984eb923e431b824767001b7d62d8bca92f288bf7426`
- `trust-q4-scenario-b-review-candidate.mp3`：如果你遇到危險，可以打什麼電話求助？
  - 5.250958 秒；21452 bytes；SHA-256 `747857c0a005a0564a06ad6f743b4415c6758f17ce89f3e769f336db5e397094`
- `trust-q4-correct-b-review-candidate.mp3`：答對了！好棒！
  - 2.530958 秒；10604 bytes；SHA-256 `755d4f8b36db6f36b3fe04d4ad77379ad5585355afe095caa2754fbd340ee5a8`
- `trust-q4-wrong-b-review-candidate.mp3`：再想想看喔～113 是保護專線，24 小時都有人接聽，記住這個號碼
  - 8.970958 秒；36332 bytes；SHA-256 `620a9d9d4781e8454505f96baad269f9e24184080df8086842c3ba3a61833fe8`

五檔皆 MP3／24 kHz／mono；metadata 與完整解碼通過。trust-q5-scenario 遇 quota 後即停止且未重試。三份尚未生成：trust-q5-scenario、trust-q5-correct、trust-complete。

歷史 20/23 個路徑曾生成，不等於目前檔案齊備：另有十份未入版控 scratch 檔本機找不到，待恢復並核對原雜湊。加上先前 PR #44 的五檔，本次樹內共十份可用 review drafts（BTL 另計）。

本 PR 只收錄本輪五檔及本說明；不改產品、public、E2E、CI 或部署。不代表 staging playback、主觀聽感、兒童盲聽或客戶驗收；HO-3184 尚未完成。
