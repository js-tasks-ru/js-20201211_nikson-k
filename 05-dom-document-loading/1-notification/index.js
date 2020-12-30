import { NotificationType } from './codesets.js';

export default class NotificationMessage {
  static activeElement;
  constructor(message = '', { duration = 1, type = NotificationType.success } = {}) {
    if (NotificationMessage.activeElement) {
      NotificationMessage.activeElement.remove();
    }
    this.message = message;
    this.duration = duration;
    this.msgType = type;
    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.innerHTML = `<div class="notification ${this.msgType}" style="--value:${this.duration}ms">
                      <div class="timer"></div>
                      <div class="inner-wrapper">
                        <div class="notification-header">${this.msgType}</div>
                        <div class="notification-body">
                          ${this.message}
                        </div>
                      </div>
                    </div>`;

    this.element = this.element.firstChild;

    NotificationMessage.activeElement = this.element;
  }

  show(targetElement) {
    if (targetElement) {
      targetElement.appendChild(this.element);
    } else {
      document.body.appendChild(this.element);
    }

    setTimeout(this.destroy.bind(this), this.duration);
  }

  destroy() {
    this.remove();
  }

  remove() {
    if (this.element) {
      this.element.remove();
      NotificationMessage.activeElement = null;
    }
  }
}
