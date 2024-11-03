import { v4 as uuid } from "uuid";
import OrderFactory from "./order.factory";

describe("Order factory unit tests", () => {

  it("should create an order", () => {
    const orderProps = {
      id: uuid(),
      customerId: uuid(),
      items: [
        {
          id: "1",
          name: "Product 1",
          productId: "1",
          quantity: 1,
          price: 10
        }
      ]
    }

    const order = OrderFactory.create(orderProps);
    expect(order.id).toBe(orderProps.id);
    expect(order.customerId).toBe(orderProps.customerId);
    expect(order.items).toHaveLength(1);
    expect(order.items[0].id).toBe(orderProps.items[0].id);
    expect(order.items[0].name).toBe(orderProps.items[0].name);
    expect(order.items[0].productId).toBe(orderProps.items[0].productId);
    expect(order.items[0].quantity).toBe(orderProps.items[0].quantity);
    expect(order.items[0].price).toBe(orderProps.items[0].price);
  })
});