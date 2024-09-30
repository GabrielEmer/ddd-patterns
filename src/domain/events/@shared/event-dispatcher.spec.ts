import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressUpdatedEvent from "../customer/customer-address-updated.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import PrintLogWhenCutomerAddresIsChangedEventHandler from "../customer/handler/print-log-when-cutomer-addres-is-changed.handler";
import SendConsoleLog1EventHandler from "../customer/handler/send-console-log-1-handler";
import SendConsoleLog2EventHandler from "../customer/handler/send-console-log-2-handler";
import SendEmailWhenProductIsCreatedEventHandler from "../product/handler/send-email-when-product-is-created.event.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain Events unit tests", () => {
  
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedEventHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedEventHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler); 

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedEventHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler); 

    eventDispatcher.unregisterAll();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
  })

  it("should notify an event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedEventHandler();
    jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10,
      email: "teste@teste.com.br"
    });

    eventDispatcher.notify(productCreatedEvent);
    
    expect(eventHandler.handle).toHaveBeenCalledWith(productCreatedEvent);
  });

  it("should notify when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const sendEmailEventHandler = new SendConsoleLog1EventHandler();
    const sendToFinanceEventHandler = new SendConsoleLog2EventHandler();
    jest.spyOn(sendEmailEventHandler, "handle");
    jest.spyOn(sendToFinanceEventHandler, "handle");

    eventDispatcher.register("CustomerCreatedEvent", sendEmailEventHandler);
    eventDispatcher.register("CustomerCreatedEvent", sendToFinanceEventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toStrictEqual(sendEmailEventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toStrictEqual(sendToFinanceEventHandler);

    const customer = new Customer("1", "Customer 1");

    const customerCreatedEvent = new CustomerCreatedEvent({
      id: customer.id,
      name: customer.name,
      email: "teste@teste.com.br"
    });

    eventDispatcher.notify(customerCreatedEvent);
    
    expect(sendEmailEventHandler.handle).toHaveBeenCalledWith(customerCreatedEvent);
    expect(sendToFinanceEventHandler.handle).toHaveBeenCalledWith(customerCreatedEvent);
  });

  it("should notify when customer address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const printLogEventHandler = new PrintLogWhenCutomerAddresIsChangedEventHandler();
    jest.spyOn(printLogEventHandler, "handle");

    eventDispatcher.register("CustomerAddressUpdatedEvent", printLogEventHandler);

    let customer = new Customer("1", "Customer 1");
    customer.changeAddress(new Address("Street 1", 1, "Zip 1", "City 1"));
    expect(customer.address).toStrictEqual(new Address("Street 1", 1, "Zip 1", "City 1"));
    
    const customerAddressUpdatedEvent = new CustomerAddressUpdatedEvent({
      id: customer.id,
      name: customer.name,
      address: customer.address
    });

    eventDispatcher.notify(customerAddressUpdatedEvent);
    
    expect(printLogEventHandler.handle).toHaveBeenCalledWith(customerAddressUpdatedEvent);
  });

});