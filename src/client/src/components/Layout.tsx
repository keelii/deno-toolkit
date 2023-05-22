import type { ParentComponent } from "solid-js";
import { Nav } from "./Nav.tsx";

export const Layout: ParentComponent = (props) => {
  return (
    <div className="flex">
      <nav id="nav" className="w-48 h-screen overflow-y-auto">
        <Nav />
      </nav>
      <div className="h-screen border overflow-hidden"></div>
      <main id="main" className="h-screen grow flex flex-col overflow-y-auto">
        {props.children}
      </main>
    </div>
  );
};
