import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/orderItem";

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
    const transaction = await OrderModel.sequelize.transaction();

    try {
      await OrderModel.update({
        customer_id: entity.customerId,
        total: entity.total(),
      }, {
        where: { id: entity.id },
        transaction,
      });

      await Promise.all(entity.items.map(async (item) => {
        await OrderItemModel.upsert({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id, 
        }, {
          transaction,
        });
      }));
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error(`Failed to update order with id ${entity.id}:`, error);
      throw error;
    }
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