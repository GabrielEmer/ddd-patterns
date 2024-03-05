import Order from "./order";
import OrderItem from "./orderItem";

describe("Order unit tests", () => {

  it("should throw error when id is empty", () => {
    expect(() => {
      let order = new Order("", "123", []);
    }).toThrow("Id is required");
  })

  it("should throw error when customerId is empty", () => {
    expect(() => {
      let order = new Order("123", "", []);
    }).toThrow("CustomerId is required");
  })

  it("should throw error when items is empty", () => {
    expect(() => {
      let order = new Order("123", "123", []);
    }).toThrow("Items quantity should be greater than 0");
  })

  it("should calculate total", () => {
    const order = new Order("123", "123", [new OrderItem("1", "1", "Item 1", 10, 1)]);
    
    expect(order.total()).toBe(10);

    const order2 = new Order("123", "123", [
      new OrderItem("1", "1", "Item 1", 10, 2),
      new OrderItem("2", "2", "Item 2", 20, 2),
    ]);
    
    expect(order2.total()).toBe(60);
  })

})