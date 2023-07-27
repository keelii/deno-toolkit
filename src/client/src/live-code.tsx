/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { ToastContainer } from "./components/Toast.tsx";
import Playground from "./pages/Playground.tsx"

render(() => (
  <>
    <Playground />
    <ToastContainer />
  </>
), document.getElementById("root")!);
