import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css"; // Updated path for styles
import App from "@/App"; // Updated path for App
import { Provider } from "react-redux";
import { store } from "@/components/redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

