import { useEffect } from "react";

// ✅ Fix: Declare the Eleven Labs custom element globally
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
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
      {/* ✅ Now TypeScript will recognize this */}
      <elevenlabs-convai agent-id="DShUANzXt9aoVDvosGTp"></elevenlabs-convai>
    </div>
  );
};

export default ConvAI;
