import ProductFactory from "./product.factory";

describe("Product factory unit tests", () => {

  it("should create a product", () => {
    const product = ProductFactory.create("Product 1", 10);
    expect(product.id).toBeDefined();
    expect(product.name).toBe("Product 1");
    expect(product.price).toBe(10);
  })
  
})