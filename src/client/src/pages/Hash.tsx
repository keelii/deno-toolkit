import { createEffect, createSignal } from "solid-js";
import { Button } from "../components/Button.tsx";
import { Textarea } from "../components/Textarea.tsx";
import { Icon } from "../components/Icon.tsx";
import { postHash } from "../Service.ts";
import { copyToClipboard, debounce, isUrl } from "../../utils.ts";
import { Layout } from "../components/Layout.tsx";
import { usePageTitle } from "../hooks/usePageTitle.ts";
import { HashResult, Result } from "../../../interface.ts";
import { errorToast } from "../components/Toast.tsx";

export default function Hash() {
  const [message, setMessage] = createSignal("");
  const [content, setContent] = createSignal<HashResult>({
    name: "",
    md5: "",
    crc16: ["", ""],
    crc32: ["", ""],
    sha1: ["", ""],
    sha256: ["", ""],
    sha512: ["", ""],
    sha384: ["", ""],
  });
  const [url, setUrl] = createSignal("0");
  const [status, setStatus] = createSignal({
    md5: 0,
    crc16: 0,
    crc32: 0,
    sha1: 0,
    sha256: 0,
    sha512: 0,
    sha384: 0,
  });

  const doHash = async (msg: string | FormData, url: string = "") => {
    const response = await postHash(msg, url);
    const result: Result<HashResult> = await response.json();

    if (result.error) {
      errorToast(result.error);
    } else {
      setContent(result.data);
    }
  };
  const handleInput = (e: any) => {
    const text = e.target.value;
    if (isUrl(text)) {
      const yes = window.confirm(
        "Are you sure to hash content returned from this url?",
      );
      if (yes) {
        setUrl("1");
      }
    } else {
      setUrl("0");
    }

    setMessage(text);
  };
  const handleChange = (e: any) => {
    const data = new FormData();
    data.append("file", e.target.files[0]);
    doHash(data).catch(console.error);
  };
  // @ts-ignore
  const debounceInput = debounce(handleInput, 500);

  usePageTitle("Hash");

  createEffect(() => {
    doHash(message(), url()).catch(console.error);
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="flex mb-6">
          <Textarea
            size="lg"
            placeholder="Put your chars here..."
            className="mr-4"
            value={message()}
            onInput={debounceInput}
          />
          <Button
            icon
            size="lg"
            type="secondary"
            className="relative overflow-hidden"
          >
            <Icon name="upload" className="text-green-800 mr-2" /> Upload
            <input
              type="file"
              size="100"
              id="file"
              onChange={handleChange}
              className="absolute right-0 opacity-0 w-full h-full"
            />
          </Button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <colgroup>
              <col width="70" />
              <col width="auto" />
            </colgroup>
            <thead className="text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-3 py-4">Method</th>
                <th scope="col" className="px-3 py-4 flex justify-between">
                  <span>Result</span>
                  <span className="font-normal">{content().name || ""}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <abbr title="Message-Digest Algorithm">MD5</abbr>
                </td>
                <td className="px-3 py-4">
                  <Textarea readonly value={content().md5} />
                </td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <abbr title="Cyclic Redundancy Check">CRC</abbr>
                </td>
                <td className="px-3 py-4">
                  <table className="w-full" cellPadding={5}>
                    <colgroup>
                      <col width="80" />
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Integer</th>
                        <th>Hex</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>crc16</td>
                        <td>
                          <Textarea
                            readonly
                            className="mr-2"
                            value={content().crc16[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            readonly
                            value={content().crc16[1]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>crc32</td>
                        <td>
                          <Textarea
                            readonly
                            className="mr-2"
                            value={content().crc32[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            readonly
                            value={content().crc32[1]}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-3 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  <abbr title="Secure Hash Algorithm">SHA</abbr>
                </td>
                <td className="px-3 py-4">
                  <table className="w-full" cellPadding={5}>
                    <colgroup>
                      <col width="80" />
                      <col width="auto" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th></th>
                        <th>digest</th>
                        <th>
                          <a
                            target="_blank"
                            href="https://developer.mozilla.org/zh-CN/docs/Web/Security/Subresource_Integrity"
                          >
                            Subresource Integrity
                          </a>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>SHA-1</td>
                        <td>
                          <Textarea
                            readonly
                            value={content().sha1[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            title="Subresource Integrity"
                            readonly
                            value={"sha1-" + content().sha1[1]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>SHA-256</td>
                        <td>
                          <Textarea
                            readonly
                            value={content().sha256[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            readonly
                            title="Subresource Integrity"
                            value={"sha256-" + content().sha256[1]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>SHA-512</td>
                        <td>
                          <Textarea
                            rows={2}
                            readonly
                            value={content().sha512[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            rows={2}
                            title="Subresource Integrity"
                            readonly
                            value={"sha512-" + content().sha512[1]}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td>SHA-384</td>
                        <td>
                          <Textarea
                            rows={2}
                            readonly
                            value={content().sha384[0]}
                          />
                        </td>
                        <td>
                          <Textarea
                            rows={2}
                            title="Subresource Integrity"
                            readonly
                            value={"sha384-" + content().sha384[1]}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
