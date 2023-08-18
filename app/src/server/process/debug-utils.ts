import fs from "fs";

export const debugSaveData = (name: string, data: any) => {
  const path = `./tmp/debug-${name}.json`;
  const dataStr = JSON.stringify(data, null, 2);
  fs.writeFileSync(path, dataStr);
};
