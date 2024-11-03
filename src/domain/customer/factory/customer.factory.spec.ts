import Address from "../value-objects/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit tests", () => {
  
  it("should create a customer", () => {
    const customer = CustomerFactory.create("John");
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.rewardPoints).toBe(0);
    expect(customer.address).toBeUndefined();
  })

  it("should create a customer with address", () => {
    const customer = CustomerFactory.createWithAddress("John", new Address("Street", 1, "Zip", "City"));
    expect(customer.id).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.rewardPoints).toBe(0);
    expect(customer.address).toStrictEqual(new Address("Street", 1, "Zip", "City"));
  })
})