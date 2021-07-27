import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import {
  Provider as Web3Provider,
  Updater as Web3Updater,
} from "./contexts/Web3";
import {
  Provider as MultiSigWalletProvider,
  Updater as MultiSigWalletUpdater,
} from "./contexts/MultiSigWallet";
import "./index.css";
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <MultiSigWalletProvider>
        <App />
        <Web3Updater />
        <MultiSigWalletUpdater />
      </MultiSigWalletProvider>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
