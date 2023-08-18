import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  input: ["src/**/*.ts", "src/**/*.tsx"],
  output: path.resolve(__dirname, "public/locales/$LOCALE/$NAMESPACE.json"),
  locales: ["en"],
  sort: true,
  verbose: true,
  keepRemoved: true,

  defaultValue: "*TRANSLATE*",
  defaultNamespace: "affiliate",

  lexers: {
    ts: [
      {
        lexer: "JavascriptLexer",
        functions: ["t", "dt"],
        namespaceFunctions: [
          "useTranslation",
          "withTranslation",
          "declareTranslationNS",
        ],
      },
    ],
    tsx: [
      {
        lexer: "JsxLexer",
        functions: ["t", "dt"],
        namespaceFunctions: ["useTranslation", "withTranslation"],
      },
    ],
    default: ["JavascriptLexer"],
  },
};
