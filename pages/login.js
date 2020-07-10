import Head from "next/head";
import Router from "next/router";
import LoginBox from "../components/loginBox";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Login() {
  const token = useSelector((state) => state.user.token);
  // console.log(token);
  useEffect(() => {
    if (token) {
      console.log("have");
      Router.push({
        pathname: "/dashboard",
      });
    } else {
      console.log("dont have token");
    }

    return () => {};
  }, []);

  return (
    <div className="container">
      <Head>
        <title>KoiFish App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <img className="coverimg" src="/assets/450283d.jpg" />
        <LoginBox />
      </main>
    </div>
  );
}
