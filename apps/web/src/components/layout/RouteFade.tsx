import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function RouteFade({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div
      key={key}
      className="animate-[fadeIn_500ms_ease-out]"
      style={{
        animationFillMode: "both",
      }}
    >
      {children}
      <style>{`@keyframes fadeIn{from{opacity:0;filter:blur(6px);transform:translateY(8px)}to{opacity:1;filter:blur(0);transform:translateY(0)}}`}</style>
    </div>
  );
}
