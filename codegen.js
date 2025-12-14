import { codegen } from "swagger-axios-codegen";
import path from "path";

async function generateCodegen() {
  codegen({
    methodNameMode: "operationId",
    source: (await import("./swagger.json", { with: { type: "json" } }))
      .default,
    outputDir: path.resolve(
      path.dirname(new URL(import.meta.url).pathname),
      "src/shared/api/generated/"
    ),
    fileName: "index.ts",
    methodNameMode: "operationId",
    modelMode: "interface",
    useClassTransformer: false,
    strictNullChecks: true,
    serviceNameSuffix: "Service",
    enumNamePrefix: "Enum",
    useStaticMethod: true,
    useCustomerRequestInstance: true,
  });
}

generateCodegen();
