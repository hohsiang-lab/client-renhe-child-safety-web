import { useNavigate } from "react-router-dom";

export default function SecretGamePage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 text-3xl font-bold">秘密遊戲</h1>
      <p className="text-text-light mb-8">（HO-608 實作）</p>
      <button
        onClick={() => navigate("/ending")}
        className="bg-primary hover:bg-primary-hover cursor-pointer rounded-full px-8 py-3 font-bold text-white"
      >
        完成 → 結尾頁
      </button>
    </div>
  );
}
