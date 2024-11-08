import Address from "../../../../domain/customer/value-objects/address";
import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zip: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints
    })
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update({
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zip: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints
    }, {
      where: {
        id: entity.id
      }
    })
  }
 
  async findById(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });
    } catch (error) {
      throw new Error("Customer not found");
    }

    return this.toCustomer(customerModel);
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();
    return customerModels.map(customerModel => {
      return this.toCustomer(customerModel);
    })
  }

  private toCustomer(customerModel: CustomerModel) {
    let customer = new Customer(customerModel.id, customerModel.name);
    customer.changeAddress(new Address(customerModel.street, customerModel.number, customerModel.zip, customerModel.city));
    customerModel.active ? customer.activate() : customer.deactivate();
    customer.addRewardPoints(customerModel.rewardPoints);
    return customer;
  }
  
}