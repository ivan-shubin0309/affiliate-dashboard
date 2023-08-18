// Constants and other functions should be defined, too:
import type { PrismaClient } from "@prisma/client";

const chars = "123456789bcdfghjkmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ";
const checkUrlExists = true;

export async function urlToShortCode(
  prisma: PrismaClient,
  url: string
): Promise<string> {
  if (url === "") {
    throw new Error("No URL was supplied.");
  }

  if (!validateUrlFormat(url)) {
    throw new Error("URL does not have a valid format.");
  }

  if (checkUrlExists) {
    if (!(await verifyUrlExists(url))) {
      throw new Error(`${url} URL does not appear to exist.`);
    }
  }

  let shortCode = await urlExistsInDb(prisma, url);
  if (!shortCode) {
    shortCode = await createShortCode(prisma, url);
  }

  return shortCode;
}

function validateUrlFormat(url: string): boolean {
  const urlRegex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
  return urlRegex.test(url);
}

async function verifyUrlExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });

    // Check if the response status is not 404
    return response.status !== 404;
  } catch (error) {
    console.error(`Error verifying URL: ${error}`);
    return false;
  }
}

async function urlExistsInDb(
  prisma: PrismaClient,
  url: string
): Promise<string | null> {
  // Check for '&pta=' in the URL and modify the URL if it exists
  const urlToCheck = url.includes("&pta=") ? url.split("&pta=")[0] : url;

  const result = await prisma.short_urls.findFirst({
    where: {
      long_url: {
        startsWith: urlToCheck,
      },
    },
    select: {
      short_code: true,
    },
  });

  return result ? result.short_code.toString() : null;
}

async function createShortCode(
  prisma: PrismaClient,
  url: string
): Promise<string> {
  const id = await insertUrlInDb(url, prisma);
  const shortCode = convertIntToShortCode(id);
  await insertShortCodeInDb(prisma, id, shortCode);
  return shortCode;
}

// Implement the following methods in your class
const insertUrlInDb = async (
  url: string,
  prisma: PrismaClient
): Promise<number> => {
  // const query = `INSERT INTO short_urls (long_url) VALUES ('${url}')`;
  await prisma.short_urls.create({
    data: { long_url: url, short_code: Buffer.from("", "utf8") },
  });

  const url2 = url.includes("&pta=") ? url.split("&pta=")[0] : url;

  // const maxIdQuery = `SELECT max(id) as id FROM short_urls WHERE long_url like '${url2}%' LIMIT 1`;
  const maxIdResult = await prisma.short_urls.aggregate({
    where: {
      long_url: { contains: url2 },
    },
    _max: {
      id: true,
    },
  });

  return maxIdResult._max.id || -1;
};

const convertIntToShortCode = (id: number): string => {
  id = Math.floor(id);
  if (id < 1) {
    throw new Error("The ID is not a valid integer.");
  }

  const length = chars.length;
  if (length < 10) {
    throw new Error("Length of chars is too small");
  }

  let code = "";
  while (id > length - 1) {
    code = `${chars[id % length]}${code}`;
    id = Math.floor(id / length);
  }

  code = `${chars[id]}${code}`;
  return code;
};

const insertShortCodeInDb = async (
  prisma: PrismaClient,
  id: number,
  shortCode: string
) => {
  if (!id || !shortCode) {
    throw new Error("Input parameter(s) invalid.");
  }

  await prisma.short_urls.update({
    where: { id },
    data: { short_code: Buffer.from(shortCode) },
  });
};
