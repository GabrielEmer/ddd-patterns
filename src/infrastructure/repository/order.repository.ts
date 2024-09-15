import Order from "../../domain/entity/order";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/orderItem";

export default class OrderRepository implements OrderRepositoryInterface {
  
  async create(entity: Order): Promise<void> {
    await OrderModel.create({
      id: entity.id,
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity
      })),
    }, {
      include: [{ model: OrderItemModel }],
    })
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update({
      customer_id: entity.customerId,
      total: entity.total(),
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity
      })),
    }, {
      where: {
        id: entity.id
      }
    })
  }

  async findById(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
      rejectOnEmpty: true,
    });

    const orderItems = orderModel.items.map((item) => this.toOrderItem(item));
    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }
  
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [{ model: OrderItemModel }],
    });

    return orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => this.toOrderItem(item));
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }

  private toOrderItem(item: OrderItemModel): OrderItem {
    return new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity);
  }
}