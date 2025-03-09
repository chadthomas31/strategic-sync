import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar"; // ✅ Navbar globally
import ConvAI from "../components/ConvAI"; // ✅ Import chatbot

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar /> {/* ✅ Navbar appears on all pages */}
      <Component {...pageProps} />
      <ConvAI /> {/* ✅ Chatbot appears on all pages */}
    </>
  );
}
