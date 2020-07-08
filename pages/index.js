import Head from "next/head";
import Header from "../components/header";
import LoginBox from "../components/loginBox";
import { useSelector } from "react-redux";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>KoiFish App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <main></main>
    </div>
  );
}
