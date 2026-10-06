# HO-3184：10/06 AI 配音審聽草稿

僅供 review，未正式核准、未整合 app；目錄位於 public 之外。Gemini `gemini-2.5-flash-preview-tts`／`Kore`，B 方向提示僅在程序內套用。原核准文字 source：`9108c0a04d50183af029aef06ddcf6748114e117`。

- `trust-q5-scenario-b-review-candidate.mp3`：遇到問題時，可以從下面選一位你覺得安全、願意聽你說的大人求助：
  - 7.930958 秒；32204 bytes；SHA-256 `ae69b7f24fe052051498d758323e86406f26b7be36c40afb025dfd287902f7bb`
- `trust-q5-correct-b-review-candidate.mp3`：你可以選一位可能願意幫助你的大人。 這些身分只是可能的求助對象，沒有哪種身分一定安全。若第一位沒有幫忙，可以再告訴下一位你覺得安全、願意聽你說的大人。
  - 18.770958 秒；75596 bytes；SHA-256 `0a13146357434ae0a608ee9116de815a7945789db91be05d59b79627e77bff9d`
- `trust-complete-b-review-candidate.mp3`：太棒了！你可以找一位你覺得安全、願意聽你說的大人幫忙。 如果第一位大人沒有相信你或沒有幫助你，可以繼續告訴下一位你覺得安全、願意聽你說的大人。
  - 17.810958 秒；71756 bytes；SHA-256 `7a2f5796c973a1373220b2bf60873f3aa2033397f4f8fcf60aa987f9586c83ee`

三檔 MP3／24 kHz／mono，完整解碼與雜湊通過。歷史23/23路徑曾生成，但十份舊 scratch 檔仍缺；本樹含13/23份可用草稿（BTL另計），不是全套驗收。此 PR 只新增三個 MP3 與本說明，不含生成器、app/public、E2E/CI、部署變更。正式審聽、產品整合、播放核對、合規盲聽及客戶驗收仍待完成。
