type EventHandler = (...args: any[]) => void;

export class EventEmitter {
  private events: { [eventName: string]: EventHandler[] } = {};

  on(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(handler);
  }

  off(eventName: string, handler: EventHandler) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName] = this.events[eventName].filter((h) =>
      h !== handler
    );
  }

  emit(eventName: string, ...args: any[]) {
    if (!this.events[eventName]) {
      return;
    }
    this.events[eventName].forEach((handler) => {
      handler.apply(null, args);
    });
  }
}
