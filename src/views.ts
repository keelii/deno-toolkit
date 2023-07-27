import { IS_DEV, PORT, SERVICE_URL, SITE_ROOT } from "./config/server.ts";
import { CHARSET, HTML_LANG } from "./config/client.ts";

export const REACT = `
  <script src="//storage.360buyimg.com/dest/react.production.min.js"></script>
  <script src="//storage.360buyimg.com/dest/react-dom.production.min.js"></script>`;

export const LZUTF8 = `
  <script src="//storage.360buyimg.com/dest/lzutf8.min.js"></script>
  <script>
    function compressText(str) { return LZUTF8.compress(str, {outputEncoding: "Base64"}) }
    function decompressText(str) { return LZUTF8.decompress(str, {inputEncoding: "Base64"}) }
  </script>`;

const GA_TAG = `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-96N6BQ6VCP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-96N6BQ6VCP');
  </script>`;

// deno-fmt-ignore
export const Layout = `<!DOCTYPE html>
<html lang="${HTML_LANG}">
<head>
  <meta charset="${CHARSET}">
  <title>{{title}}</title>
  <link rel="shortcut icon" type="image/ico" href="favicon.ico" />
  <script>
    window.__IS_DEV__ = ${IS_DEV}
    window.__SITE_ROOT__ = ${`"${SITE_ROOT}"`}
    window.__SERVICE_URL__ = ${`"${SERVICE_URL}"`}
    {{inlineGlobal}}
  </script>
  ${IS_DEV ? '' : '<link rel="stylesheet" href="static/index.css" />'}
  {{headScript}}
  
  ${GA_TAG}
</head>
<body>
  <div id="root"></div>
  
  <% yield %>

</body> 
</html>`;

export const PreviewLayout = `<!DOCTYPE html>
<html lang="${HTML_LANG}">
<head>
  <meta charset="${CHARSET}">
  <title>{{title}}</title>
  
  ${GA_TAG}
</head>
<body>
  <div id="root"></div>
  
  <% yield %>

</body> 
</html>`;

const DefaultData = {
  title: "",
  body: "",
  headScript: "",
  bodyScript: "",
  inlineGlobal: "",
  livecode: "",
};
const STATIC_URL_PREFIX = IS_DEV ? "http://localhost:3000/src/" : "static/";
const ext = IS_DEV ? "tsx" : "js";

export const IndexView = `
  <script src="${STATIC_URL_PREFIX}index.${ext}" type="module"></script>
`;
export const FormatView = `
  <script src="${STATIC_URL_PREFIX}format.${ext}" type="module"></script>
`;
export const DiffView = `
  <script src="${STATIC_URL_PREFIX}diff.${ext}" type="module"></script>
`;
export const HashView = `
  <script src="${STATIC_URL_PREFIX}hash.${ext}" type="module"></script>
`;
export const LiveCodeView = `
  <script src="${STATIC_URL_PREFIX}live-code.${ext}" type="module"></script>
  
  ${LZUTF8}

  ${REACT}
`;
export const PlaygroundView = `
  <script src="${STATIC_URL_PREFIX}index.${ext}" type="module"></script>
  
  ${LZUTF8}

  ${REACT}
`;
export const PreviewView = `
  ${REACT}
  <script>{{code}}</script>
`;
export const CompressView = `
  <script src="${STATIC_URL_PREFIX}index.${ext}" type="module"></script>
  
  ${LZUTF8}
`;
export const IframeView = `
`;

export function render(
  html: string,
  data: Record<string, any>,
  layout: string = Layout,
) {
  return Object.entries(Object.assign(DefaultData, data)).reduce(
    (acc, [k, v]) => {
      return acc.replaceAll(`{{${k}}}`, v);
    },
    layout.replace("<% yield %>", html),
  );
}

export function HtmlResponse(html: string, data: Record<string, any>) {
  return new Response(render(html, data), {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}
