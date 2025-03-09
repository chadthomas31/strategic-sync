import { useEffect } from "react";

// ✅ Fix: Extend JSX Intrinsic Elements to allow the custom tag
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": any; // ✅ Declare custom element
    }
  }
}

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
      <elevenlabs-convai agent-id="DShUANzXt9aoVDvosGTp"></elevenlabs-convai>
    </div>
  );
};

export default ConvAI;
