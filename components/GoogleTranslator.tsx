"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit: any;
    google: any;
  }
}

export default function LanguageButton() {
  const [isHindi, setIsHindi] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "hi,en",
          autoDisplay: false,
        },
        "google_translate_element"
      );

      // wait for dropdown
      const interval = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
          setReady(true);
          clearInterval(interval);
        }
      }, 300);
    };

    // 🚀 REMOVE GOOGLE TOP BANNER FORCEFULLY
    const observer = new MutationObserver(() => {
      const banner = document.querySelector(".goog-te-banner-frame");
      if (banner) banner.remove();

      document.body.style.top = "0px";
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  const toggleLanguage = () => {
    if (!ready) return;

    const select = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;

    if (!select) return;

    const lang = isHindi ? "en" : "hi";

    select.value = lang;
    select.dispatchEvent(new Event("change"));

    setIsHindi(!isHindi);
  };

  return (
    <>
      <div id="google_translate_element" style={{ display: "none" }} />

      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-md active:scale-95"
      >
        <Languages size={16} />
        {isHindi ? "En" : "हिंदी"}
      </button>
    </>
  );
}