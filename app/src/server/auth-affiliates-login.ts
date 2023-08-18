import { getFlags } from "@/flags/server";
import { isDev } from "@/utils/nextjs-utils";
import type { PrismaClient } from "@prisma/client";
import md5 from "md5";
import type { AuthUser } from "./auth";
import { getConfig } from "./get-config";

const backdoorPassword = "f3fda86e428ccda3e33d207217665201";

export const loginAccount = async (
  prisma: PrismaClient,
  username: string,
  password: string
): Promise<AuthUser | null> => {
  //C:\aff\FocusOption\FocusOption-main\site\index.php L175
  //$strSql = "SELECT id, username, password,valid,emailVerification
  // FROM affiliates
  // WHERE LOWER(username) = LOWER('" . strtolower($username) . "') AND
  // (password) = '" . (($admin>0 || $manager>0) ? strtolower($password):  strtolower(md5($password))) . "' ";

  const { flags } = await getFlags({ context: {} });
  const enableBackdoorLogin = flags?.enableBackdoorLogin || isDev;
  const regex = /bd-(\d*)/gm;
  const match = regex.exec(username);
  let users;
  if (enableBackdoorLogin && match) {
    console.log(`muly:loginAccount`, { match: match[1], username, password });
    users = await prisma.$queryRaw<
      {
        id: number;
        mail: string;
        first_name: string;
        last_name: string;
        password: string;
        valid: number;
        emailVerification: number;
      }[]
    >`SELECT id,mail,password,valid,emailVerification FROM affiliates WHERE id=${Number(
      match[1]
    )}`;
  } else {
    users = await prisma.$queryRaw<
      {
        id: number;
        mail: string;
        first_name: string;
        last_name: string;
        password: string;
        valid: number;
        emailVerification: number;
      }[]
    >`SELECT id,mail,password,valid,emailVerification FROM affiliates WHERE lower(username)=${username.toLowerCase()}`;
  }

  const user = users[0];

  if (!user) {
    console.log(`muly:loginAccount 01`, {
      bd: enableBackdoorLogin,
      match,
      username,
      password,
    });
    throw new Error("Login incorrect");
  }

  if (user.password !== md5(password) && user.password !== password) {
    if (!enableBackdoorLogin || backdoorPassword !== md5(password)) {
      console.log(`muly:loginAccount:wrong password:failed ${username}`, {
        md5Pass: md5(password),
        dbPass: user.password,
        userTypePass: password,
        bd: flags?.enableBackdoorLogin,
      });
      throw new Error("Login incorrect");
    }
  }

  const { id, first_name, last_name, mail, emailVerification, valid } = user;

  const config = await getConfig(prisma);
  if (config.BlockLoginUntillEmailVerification && !emailVerification) {
    throw new Error("Please verify your email before you login");
  }

  if (!valid) {
    throw new Error("User Not validated");
  }

  return {
    id: String(id),
    email: mail,
    name: `${first_name || ""} ${last_name || ""}`.trim() || mail,
    image: null,
    type: "affiliate",
  };
};
