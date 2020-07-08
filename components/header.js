import { useSelector } from "react-redux";
import Link from "next/link";
import Router from "next/router";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch } from "react-redux";

export default function Header() {
  const dispatch = useDispatch();
  const isLogin = useSelector((state) => state.user.isLogin);

  const AUTHEN = "AUTHEN";
  const signOut = () => {
    dispatch({
      type: AUTHEN,
      isLogin: false,
      token: "",
    });
  };

  const Login = () => {
    return (
      <div>
        {isLogin ? (
          <div className="dropdown">
            <a href="#" className="name">
              John Dou
            </a>
            <div className="dropdown-content">
              <a href="#">Profile Setting</a>
              <a href="#" onClick={signOut}>
                Sign Out
              </a>
            </div>
          </div>
        ) : (
          <div className="authen">
            <Link href="/login">
              <a className="authenbtn">Sign in</a>
            </Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <header>
      <div className="page-width">
        <div style={{ float: "left" }}>
          <img
            src="/assets/logos/logo-trans.png"
            style={{ width: "110px", height: "40px" }}
          />
        </div>
        <div className="menu">
          <Link href="/home">
            <a className="menubtn">Home</a>
          </Link>
          <Link href="/service">
            <a className="menubtn">Service</a>
          </Link>
          <a
            className="menubtn"
            href="https://www.koi2u.com/%e0%b8%aa%e0%b8%b4%e0%b8%99%e0%b8%84%e0%b9%89%e0%b8%b2/"
            target="_blank"
          >
            Product
          </a>
          <a
            className="menubtn"
            href="https://www.koi2u.com/%e0%b8%95%e0%b8%b4%e0%b8%94%e0%b8%95%e0%b9%88%e0%b8%ad%e0%b9%80%e0%b8%a3%e0%b8%b2/"
            target="_blank"
          >
            Contact
          </a>
        </div>
        <Login />
      </div>
    </header>
  );
}
