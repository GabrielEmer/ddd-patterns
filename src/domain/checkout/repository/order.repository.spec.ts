import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../infrastructure/db/sequelize/model/customer.model";
import OrderModel from "../../../infrastructure/db/sequelize/model/order.model";
import OrderItemModel from "../../../infrastructure/db/sequelize/model/order-item.model";
import ProductModel from "../../../infrastructure/db/sequelize/model/product.model";
import CustomerRepository from "../../../infrastructure/repository/customer.repository";
import Address from "../../customer/value-objects/address";
import Customer from "../../customer/entity/customer";
import Product from "../../product/entity/product";
import ProductRepository from "../../../infrastructure/repository/product.repository";
import OrderRepository from "./order.repository";
import OrderItem from "../entity/orderItem";
import Order from "../entity/order";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);


    const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });
    
    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
          quantity: 2,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    order.addItem(new OrderItem("2", product.id, product.name, product.price, 1));
    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
          quantity: 2,
          order_id: "123",
          product_id: "123",
        },
        {
          id: "2",
          name: "Product 1",
          price: 10,
          quantity: 1,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

    const order = new Order("123", customer.id, [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderResult = await orderRepository.findById(order.id);
    expect(order).toStrictEqual(orderResult);
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zipcode 1", "City 1"));
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
    const orderItemTwo = new OrderItem("2", product.id, product.name, product.price, 2);

    const order = new Order("123", customer.id, [orderItem]);
    const orderTwo = new Order("1234", customer.id, [orderItemTwo]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    await orderRepository.create(orderTwo);

    const orders = await orderRepository.findAll();
    expect(orders).toHaveLength(2);
    expect(orders).toContainEqual(order);
    expect(orders).toContainEqual(orderTwo);

    expect(order).not.toEqual(orderTwo);

    expect(order.items).not.toEqual(orderTwo.items);
  });

});