import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import ProductCreatedEvent from "../../../events/product/product-created.event";

export default class SendEmailWhenProductIsCreatedEventHandler implements EventHandlerInterface<ProductCreatedEvent> {

  handle(event: ProductCreatedEvent): void {
    console.log(`Enviando email para ${event.eventData.email}`);
  }
  
}