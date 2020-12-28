import { NotificationType } from './codesets.js';

let instance = null;
export default class NotificationMessage {
  element={};
  constructor(message = '', { duration = 1, type = NotificationType.success } = {}) {
    if (!instance) {
      instance = this;
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
  }

  show(targetElement) {
    if (instance.isMessageShowing){
      return;
    }
    this.isMessageShowing = true;
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
      instance = null;
    }
  }
}
