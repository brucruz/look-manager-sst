import { StackContext, Api, use } from "sst/constructs";
import { Database } from "./Database";
import { LayerVersion } from "aws-cdk-lib/aws-lambda";

const chromeAwsLayerArn =
  "arn:aws:lambda:us-east-1:764866452798:layer:chrome-aws-lambda:31";

export function API({ stack }: StackContext) {
  const chromeAwsLayer = LayerVersion.fromLayerVersionArn(
    stack,
    "ChromeLayer",
    chromeAwsLayerArn
  );

  const rds = use(Database);

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [rds],
      },
    },
    routes: {
      "GET /product/web": {
        function: {
          handler: "packages/functions/src/product/getWebProduct.handler",
          layers: [chromeAwsLayer],
          timeout: 15,
          runtime: "nodejs14.x",
          nodejs: {
            esbuild: {
              external: ["chrome-aws-lambda"],
            },
          },
        },
      },
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
