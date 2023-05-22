export function stripAnsi(str: string) {
  return str.replace(/\u001b\[[0-9;]*m/g, "");
}

export function htmlEscape(text: string) {
  const replacements = [
    [/&/g, "&amp;"],
    [/</g, "&lt;"],
    [/>/g, "&gt;"],
    [/'/g, "&apos;"],
    [/"/g, "&quot;"],
  ];
  let html = text;

  for (let i = 0; i < replacements.length; i++) {
    html = html.replace(replacements[i][0], <string> replacements[i][1]);
  }
  return html;
}
