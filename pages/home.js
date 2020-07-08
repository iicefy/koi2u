import Router from "next/router";
import Link from "next/link";
import Head from "next/head";
import Header from "../components/header";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="mainApp">
          <div className="page">
            <div className="block1">
              <p className="headText">IoT Dashboard</p>
            </div>
            <div className="block-container">
              <div className="block2">
                <p className="headText">Factor Note</p>
              </div>
              <div className="block3">
                <p className="headText">Koi2u Farm Service</p>
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </main>
    </div>
  );
}
