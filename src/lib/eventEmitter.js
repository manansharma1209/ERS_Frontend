class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);

    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.events.has(event)) return;
    this.events.get(event).delete(callback);
    if (this.events.get(event).size === 0) {
      this.events.delete(event);
    }
  }

  emit(event, data) {
    if (!this.events.has(event)) return;
    this.events.get(event).forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  once(event, callback) {
    const onceWrapper = (data) => {
      callback(data);
      this.off(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  clear() {
    this.events.clear();
  }
}

export const eventEmitter = new EventEmitter();

// Event names constants
export const Events = {
  EXPENSE_CREATED: 'expense:created',
  EXPENSE_UPDATED: 'expense:updated',
  EXPENSE_DELETED: 'expense:deleted',
  EXPENSE_STATUS_CHANGED: 'expense:status_changed',
  USER_CREATED: 'user:created',
  USER_UPDATED: 'user:updated',
  USER_STATUS_CHANGED: 'user:status_changed',
  NOTIFICATION_RECEIVED: 'notification:received',
  SESSION_EXPIRED: 'session:expired',
  ERROR_OCCURRED: 'error:occurred'
};