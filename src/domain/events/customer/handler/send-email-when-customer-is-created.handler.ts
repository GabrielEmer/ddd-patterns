import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendEmailWhenCustomerIsCreatedEventHandler implements EventHandlerInterface<CustomerCreatedEvent> {

  handle(event: CustomerCreatedEvent): void {
    console.log(`Enviando email de criação para o cliente ${event.eventData.name}`);
  }
  
}