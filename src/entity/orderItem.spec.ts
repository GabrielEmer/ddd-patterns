import OrderItem from "./orderItem";

describe("OrderItem unit tests", () => {

  it("should throw error when id is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("", "1", "Item 1", 10, 1);
    }).toThrow("Id is required");
  })

  it("should throw error when productId is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "", "Item 1", 10, 1);
    }).toThrow("ProductId is required");
  })

  it("should throw error when name is empty", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "1", "", 10, 1);
    }).toThrow("Name is required");
  })

  it("should throw error when price is less or equal zero", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "1", "Item 1", 0, 1);
    }).toThrow("Price must be greater than zero");
  })

  it("should throw error when quantity is less or equal zero", () => {
    expect(() => {
      let orderItem = new OrderItem("1", "1", "Item 1", 10, 0);
    }).toThrow("Quantity must be greater than zero");
  })

  it("should return total price when have more than one", () => {
    const orderItem = new OrderItem("1", "1", "Item 1", 10, 2);
    expect(orderItem.totalPrice).toBe(20);
  })
})