import React, { useEffect, useState } from "react";

const ConvAI = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const script = document.createElement("script");
    script.src = "https://elevenlabs.io/convai-widget/index.js";
    script.async = true;
    script.type = "text/javascript";
    document.body.appendChild(script);
    
    return () => {
      // Clean up the script when component unmounts
      const existingScript = document.querySelector('script[src="https://elevenlabs.io/convai-widget/index.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  if (!isClient) {
    return null; // Return nothing during SSR
  }

  return (
    <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}>
      {/* ✅ Fix: Render the chatbot dynamically while avoiding TypeScript issues */}
      {React.createElement("elevenlabs-convai", { "agent-id": "DShUANzXt9aoVDvosGTp" })}
    </div>
  );
};

export default ConvAI;
