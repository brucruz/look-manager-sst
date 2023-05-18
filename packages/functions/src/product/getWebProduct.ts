import * as t from "io-ts";
// import { ApiHandler } from "sst/node/api";
import { apiLambdaRawHandler } from "@look-manager/core/cdk-util/lambda-wrapper/api-lambda-wrapper";
import { fetchProductFromUrl } from "../../../stacks/store-integrations";

export type GetWebProductEnv = {};

const inputType = t.type({});

export type GetWebProductInput = t.TypeOf<typeof inputType>;
export type GetWebProductResult = undefined;

export const handler = apiLambdaRawHandler(
  async ({ queryStringParameters }, _ctx, _env, headers) => {
    const productUrl = queryStringParameters?.url;

    if (!productUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Missing url query parameter",
        }),
      };
    }

    const product = await fetchProductFromUrl(productUrl);

    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  }
);
