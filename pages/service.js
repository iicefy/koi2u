import Head from "next/head";
import Header from "../components/header";
import LoginBox from "../components/loginBox";
import Dashboard from "./dashboard";

export default function Service() {
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
