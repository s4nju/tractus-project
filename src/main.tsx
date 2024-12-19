import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./components/layout";
import App from "./app";

async function enableMocking() {
  if (import.meta.env.VITE_NODE_ENV === "development") {
    console.log("Enabling mocking");
    const { worker } = await import("./mocks/browser");
    worker.start();
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Layout>
      <App />
    </Layout>
  );
});
