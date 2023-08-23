import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import NextNProgress from "nextjs-progressbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <NextNProgress />
      <Component {...pageProps} />;
    </>
  );
}
