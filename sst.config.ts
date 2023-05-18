import { SSTConfig } from "sst";
import { API } from "./stacks/API";
import { Database } from "./stacks/Database";

export default {
  config(_input) {
    return {
      name: "look-manager",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(Database).stack(API);
  },
} satisfies SSTConfig;
