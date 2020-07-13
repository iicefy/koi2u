import Head from "next/head";
import Router from "next/router";
import Header from "../components/header";
import LoginBox from "../components/loginBox";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>KoiFish App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="index">
          <div className="leftBlock">
            <div className="logo">
              <img
                src="/assets/logos/logo-trans.png"
                style={{ width: "110px", height: "43px" }}
              />
            </div>
          </div>
          <div className="rightBlock">
            <div className="brand">Koi2u</div>
            <div className="descriptionBrand">
              Fish pond care and maintenance
            </div>
            <div className="descriptionBrand">with IoT Application System</div>
            <div className="rowBtnIndex">
              <div className="serviceList">
                <a
                  className="createBookingContainer"
                  href="https://www.koi2u.com/"
                  target="_blank"
                >
                  Go to Koi2u.com
                </a>
              </div>
              <div className="serviceList">
                <div
                  className="createBookingContainer"
                  onClick={() => {
                    Router.push({
                      pathname: "/login",
                    });
                  }}
                >
                  Sign in Dashboard
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
