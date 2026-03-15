import React from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPrivacidade() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-x-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Privacidade e segurança</h1>
      </div>
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-x-text-secondary">
        <Lock className="w-12 h-12 opacity-30" />
        <p className="text-[15px]">Em breve</p>
      </div>
    </div>
  );
}
