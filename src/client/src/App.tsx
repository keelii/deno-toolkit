import { useRoutes } from "@solidjs/router";
import Format from "./pages/Format.tsx";
import Diff from "./pages/Diff.tsx";
import Hash from "./pages/Hash.tsx";
import Design from "./pages/Design.tsx";
import Encoding from "./pages/Encoding.tsx";
import { NavType } from "./const.ts";

export function App() {
  const Routes = useRoutes([
    { path: "/", component: Format },
    { path: "/" + NavType.Format, component: Format },
    { path: "/" + NavType.Diff, component: Diff },
    { path: "/" + NavType.Hash, component: Hash },
    { path: "/" + NavType.Design, component: Design },
    { path: "/" + NavType.Encoding, component: Encoding },
  ]);

  return <Routes />;
}
