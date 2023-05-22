import { Sha1 } from "https://deno.land/std@0.119.0/hash/sha1.ts";
import { Sha256 } from "https://deno.land/std@0.119.0/hash/sha256.ts";
import { Sha512 } from "https://deno.land/std@0.119.0/hash/sha512.ts";
import { Sha3_384 as Sha384 } from "https://deno.land/std@0.119.0/hash/sha3.ts";
import { Md5 } from "https://deno.land/std@0.119.0/hash/md5.ts";
import { crc16, crc32 } from "https://esm.sh/crc@4.3.2/";
import { HashResult, Result } from "../interface.ts";

function base64(buf: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

class HashString {
  name: string;
  md5: Md5;
  crc16: number;
  crc32: number;
  sha1: Sha1;
  sha256: Sha256;
  sha512: Sha512;
  sha384: Sha384;

  constructor(content: string | ArrayBuffer, name: string = "") {
    this.name = name;
    this.md5 = new Md5().update(content);
    this.crc16 = crc16(content);
    this.crc32 = crc32(content);
    this.sha1 = new Sha1().update(content);
    this.sha256 = new Sha256().update(content);
    this.sha512 = new Sha512().update(content);
    this.sha384 = new Sha384().update(content);
  }
  toString(): HashResult {
    return {
      name: this.name,
      md5: this.md5.toString(),
      crc16: [this.crc16.toString(), this.crc16.toString(16)],
      crc32: [this.crc32.toString(), this.crc32.toString(16)],
      sha1: [this.sha1.toString(), base64(this.sha1.arrayBuffer())],
      sha256: [this.sha256.toString(), base64(this.sha256.arrayBuffer())],
      sha512: [this.sha512.toString(), base64(this.sha512.arrayBuffer())],
      sha384: [this.sha384.toString(), base64(this.sha384.digest())],
    };
  }
}

export async function handleHash(
  request: Request,
): Promise<Result<HashResult>> {
  const result = {
    data: {} as HashResult,
    error: "",
  };

  try {
    if (request.method === "GET") {
      const param = new URL(request.url).searchParams;
      const msg = param.get("msg") || "";
      const url = param.get("url") || "0";

      if (url === "1") {
        const response = await fetch(msg);
        const content = await response.arrayBuffer();
        result.data = new HashString(content).toString();
      } else {
        result.data = new HashString(msg).toString();
      }
    }
    if (request.method === "POST") {
      const formData = await request.formData();

      if (!formData.has("file")) {
        result.error = "file is required";
      } else {
        const file = formData.get("file") as File;
        const content = await file.arrayBuffer();
        result.data = new HashString(content, file.name).toString();
      }
    }
  } catch (e) {
    result.error = e.message;
    console.error(e);
  }
  return result;
}
