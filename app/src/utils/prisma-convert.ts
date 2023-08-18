import { map } from "rambda";
import { Decimal } from "decimal.js";

type ConvertPrismaResultsToNumbers<T> = {
  [K in keyof T]: T[K] extends Decimal | bigint ? number : T[K];
};

export const convertPrismaResultsToNumbers = <
  T extends Record<string, unknown>
>(
  data: T
): ConvertPrismaResultsToNumbers<T> => {
  const result = Object.fromEntries(
    Object.entries(data).map(([key, val]) => {
      if (val instanceof Decimal) {
        val = val.toNumber();
      } else if (typeof val === "bigint") {
        val = Number(val);
      } else if (
        typeof val === "object" &&
        typeof (val as any).s === "number"
      ) {
        val = Number(val);
      }
      return [key, val];
    })
  );

  return result as ConvertPrismaResultsToNumbers<T>;
};
