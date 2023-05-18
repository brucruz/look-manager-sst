import rds from "..";
import { ProductInsertion, ProductDb } from "./product.types";

export namespace OrderQueries {
  export async function insertProducts(products: ProductInsertion[]) {
    return rds.insertInto("product").values(products).returning("id").execute();
  }

  export async function listAllProducts() {
    return rds.selectFrom("product").execute() as Promise<ProductDb[]>;
  }
}
