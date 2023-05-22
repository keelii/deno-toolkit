import { Icon } from "./Icon.tsx";
import { capitalize } from "../../utils.ts";
import { A } from "@solidjs/router";
import { NavType } from "../const.ts";

const navs: NavType[] = [
  NavType.Format,
  NavType.Diff,
  NavType.Hash,
];

if (window.__IS_DEV__) {
  navs.push(NavType.Design);
}

export function Nav() {
  return (
    <ul className="py-4 space-y-2">
      {navs.map((nav) => (
        <li>
          <A
            href={"/" + nav}
            class="px-4 py-2 flex items-center"
            activeClass="bg-gray-200"
          >
            <Icon name={nav} className="mr-2" />
            {capitalize(nav)}
          </A>
        </li>
      ))}
    </ul>
  );
}
