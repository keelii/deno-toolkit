/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import { ToastContainer } from "./components/Toast.tsx";
import { PlaygroundBody } from "./pages/Playground.tsx";

render(() => (
  <>
    <PlaygroundBody />
    <ToastContainer />
  </>
), document.getElementById("root")!);
