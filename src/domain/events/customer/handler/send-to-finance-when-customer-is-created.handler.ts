import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendToFinanceWhenCustomerIsCreatedEventHandler implements EventHandlerInterface<CustomerCreatedEvent> {

  handle(event: CustomerCreatedEvent): void {
    console.log(`Enviando dados do cliente para o financeiro ${event.eventData}`);
  }
  
}