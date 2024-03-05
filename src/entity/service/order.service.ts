import Customer from "../customer";
import Order from "../order";
import OrderItem from "../orderItem";
import {v4 as uuid} from 'uuid';

export default class OrderService {

  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    if (items.length === 0) {
      throw new Error("Order must have at least one item");
    }

    const order = new Order(uuid(), customer.id, items);
    customer.addRewardPoints(order.total() / 2);
    return order;
  }
  static total(orders: Order[]): number {
    return orders.reduce((total, order) => total + order.total(), 0);
  }
}