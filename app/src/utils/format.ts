export const valueFormat = {
  CURRENCY: "currency",
  NUMBER: "number",
  STRING: "string",
};

export const formatNumber = (num: number | undefined) => {
  const formatWithSuffix = (value: number, suffix: string) => {
    const formattedValue =
      Math.abs(value) >= 10 || Number.isInteger(value)
        ? Math.round(value)
        : Math.round(value * 10) / 10;
    return formattedValue.toString() + suffix;
  };

  if (num === undefined) {
    return "";
  }

  const rnum = Math.abs(Math.round(num));
  if (rnum >= 1000000) {
    return formatWithSuffix(num / 1000000, "M");
  } else if (rnum >= 1000) {
    return formatWithSuffix(num / 1000, "K");
  } else {
    return formatWithSuffix(num, "");
  }
};

export const formatPrice = (
  value: number | undefined,
  currencySymbol = "$"
) => {
  if (value === undefined) {
    return "";
  }

  if (value >= 0) {
    return `${currencySymbol}${formatNumber(value)}`;
  } else {
    return `(${currencySymbol}${formatNumber(Math.abs(value))})`;
  }
};

export const isNumeric = (value?: number | string) => {
  if (!value) {
    return false;
  }
  let v = `${value}`;
  v = v.replace("$", "");
  v = v.replace("%", "");
  return !Number.isNaN(parseFloat(v));
};
export const firstLetterUpperCase = (string?: string | null) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const convertToNumber = (value: number | string): number => {
  if (!value) {
    return 0;
  }
  let v = `${value}`;
  v = v.replace("$", "");
  v = v.replace("%", "");
  v = v.replace(",", "");
  if (Number.isNaN(parseFloat(v))) {
    return 0;
  }
  return parseFloat(v);
};

export const performanceFormatter = (number: number) => {
  return Intl.NumberFormat("us").format(number).toString();
};
