import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "lib/**/*.{ts,tsx}"],
    ignores: ["lib/data/**"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.type='MemberExpression'][callee.property.name='rpc']",
          message: "Queries Supabase devem ficar em lib/data."
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.property.name='from']:not([callee.object.name='Array']):not([callee.object.name='Buffer'])",
          message: "Queries Supabase devem ficar em lib/data."
        }
      ]
    }
  },
  globalIgnores([".next/**", "node_modules/**", "supabase/.temp/**"])
]);
