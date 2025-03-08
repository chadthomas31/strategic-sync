import type { AppProps } from "next/app";
import "../styles/globals.css";
import Navbar from "../components/Navbar"; // ✅ Importing Navbar globally

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar /> {/* ✅ Navbar appears on all pages */}
      <Component {...pageProps} />
    </>
  );
}
