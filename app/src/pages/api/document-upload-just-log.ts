import { Writable } from "stream";
import FormData from "form-data";
import { PassThrough } from "stream";
import axios from "axios";

import formidable from "formidable";
import type { NextApiRequest, NextApiResponse, PageConfig } from "next";
import { env } from "../../env.mjs";
import { castError } from "../../utils/errors";

const formidableConfig = {
  keepExtensions: true,
  maxFileSize: 10_000_000,
  maxFieldsSize: 10_000_000,
  maxFields: 7,
  allowEmptyFiles: false,
  multiples: false,
};

function formidablePromise(
  req: NextApiRequest,
  opts?: Parameters<typeof formidable>[0]
): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((accept, reject) => {
    const form = formidable(opts);

    form.parse(req, (err, fields, files) => {
      // console.log(`muly:formidablePromise`, { err, fields, len: files });

      if (err) {
        return reject(err);
      }
      return accept({ fields, files });
    });
  });
}

const fileConsumer = <T = unknown>(acc: T[]) => {
  const writable = new Writable({
    write: (chunk: T, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`muly:handler:document-upload-just-log`, { method: req.method });

  if (req.method !== "POST") return res.status(404).end();

  try {
    const chunks: never[] = [];

    const { fields, files } = await formidablePromise(req, {
      ...formidableConfig,
      // consume this, otherwise formidable tries to save the file to disk
      fileWriteStreamHandler: () => fileConsumer(chunks),
    });

    if (fields["shared-secret"] !== env.LEGACY_PHP_ACCESS_TOKEN) {
      throw new Error("Invalid shared-secret");
    }

    const fileData = Buffer.concat(chunks); // or is it from? I always mix these up

    console.log(`muly:handler:document-upload-just-log`, {
      fields,
      chunks: chunks.length,
      files: fileData.length,
    });
    return res.status(204).end();
  } catch (_err) {
    const err = castError(_err);
    console.error(`ERROR ${err.message}`, { err });
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};

export default handler;
