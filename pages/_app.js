//style
import "../styles/global.css";
import "../styles/header.css";
import "../styles/loginBox.css";
import "../styles/sidenav.css";
import "../styles/sidenav.css";
import "../styles/pondBox.css";
import "../styles/noteBox.css";
import "../styles/service.css";

//use LocalStorage
// import { Provider } from "react-redux";
// import store from "../store/store";
// import Head from "next/head";

//use Redux persist
import { Provider } from "react-redux";
// import store from "../store/store";
import Head from "next/head";
import { PersistGate } from "redux-persist/integration/react";
import configureStore from "../store/store";
const { store, persistor } = configureStore();

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}
