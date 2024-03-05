import Address from "./entity/address";
import Customer from "./entity/customer";
import Order from "./entity/order";
import OrderItem from "./entity/orderItem";

let customer = new Customer("1", "John");
customer.address = new Address("Street", 1, "Zip", "City");
customer.activate();

let item1 = new OrderItem("1", "Item 1", 10);
let item2 = new OrderItem("2", "Item 2", 20);
let order = new Order("123", "1", [item1, item2]); 
console.log(order);
