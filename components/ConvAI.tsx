import { useEffect } from "react";

const ConvAI = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* ✅ Fix: Render the chatbot dynamically to bypass TypeScript issues */}
      {typeof window !== "undefined" &&
        React.createElement("elevenlabs-convai", { "agent-id": "DShUANzXt9aoVDvosGTp" })}
    </div>
  );
};

export default ConvAI;
