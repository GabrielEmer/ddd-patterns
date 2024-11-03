import Order from "../entity/order"
import OrderItem from "../entity/orderItem"

interface OrderFactoryProps {
  id: string
  customerId: string
  items: {
    id: string
    name: string
    price: number
    productId: string
    quantity: number
  }[]
}

export default class OrderFactory {

  static create(orderProps: OrderFactoryProps): Order {
    const items = orderProps.items.map(item => {
      return new OrderItem(item.id, item.productId, item.name, item.price, item.quantity)
    })

    return new Order(orderProps.id, orderProps.customerId, items)
  }
}