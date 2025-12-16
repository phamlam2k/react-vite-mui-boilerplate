import { codegen } from "swagger-axios-codegen";

async function generateCodegen() {
  codegen({
    methodNameMode: "operationId",
    remoteUrl: import.meta.env.VITE_SWAGGER_URL,
    outputDir: "./",
    fileName: "api-docs.ts",
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
