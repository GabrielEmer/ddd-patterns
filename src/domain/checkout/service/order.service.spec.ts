import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/orderItem";
import OrderService from "./order.service";

describe("Order service unit tests", () => {

  it("should place an order", () => {
    const customer = new Customer("123", "John");
    const item = new OrderItem("it1", "1", "Item 1", 100, 1);

    const order = OrderService.placeOrder(customer, [item]);

    expect(customer.rewardPoints).toBe(50);
    expect(order.total()).toBe(100);
  })
  
  it("should calculate total of all orders", () => {
    const total = OrderService.total([
      new Order("o1", "123", [new OrderItem("it1", "1", "Item 1", 100, 1)]), 
      new Order("o2", "123", [new OrderItem("it2", "2", "Item 2", 200, 2)])
    ]);
    
    expect(total).toBe(500);
  })  
})