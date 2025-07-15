// 消息类型
export type MessageType = 'success' | 'error' | 'info' | 'warning'

// 消息配置接口
export interface MessageOptions {
  message: string
  type?: MessageType
  duration?: number
  showClose?: boolean
}

// 消息框配置接口
export interface MessageBoxOptions {
  title?: string
  message: string
  type?: MessageType
  confirmButtonText?: string
  cancelButtonText?: string
  showCancelButton?: boolean
}

// 创建消息元素
const createMessageElement = (options: MessageOptions): HTMLElement => {
  const { message, type = 'info', duration = 3000, showClose = true } = options
  
  const messageEl = document.createElement('div')
  messageEl.className = `fixed top-4 right-4 z-50 max-w-sm alert animate-in slide-in-from-right duration-300`
  
  // 根据类型设置样式
  switch (type) {
    case 'success':
      messageEl.classList.add('alert-success')
      break
    case 'error':
      messageEl.classList.add('alert-error')
      break
    case 'warning':
      messageEl.classList.add('alert-warning')
      break
    default:
      messageEl.classList.add('alert-info')
  }

  // 消息图标
  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }

  messageEl.innerHTML = `
    <span>${iconMap[type]}</span>
    <span>${message}</span>
    ${showClose ? '<button class="btn btn-ghost btn-sm btn-circle">✕</button>' : ''}
  `

  // 关闭按钮事件
  if (showClose) {
    const closeBtn = messageEl.querySelector('button')
    closeBtn?.addEventListener('click', () => {
      removeMessage(messageEl)
    })
  }

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeMessage(messageEl)
    }, duration)
  }

  return messageEl
}

// 移除消息
const removeMessage = (element: HTMLElement) => {
  element.classList.add('animate-out', 'slide-out-to-right')
  setTimeout(() => {
    element.remove()
  }, 300)
}

// 消息函数
export const Message = (options: string | MessageOptions) => {
  const opts = typeof options === 'string' ? { message: options } : options
  const messageEl = createMessageElement(opts)
  document.body.appendChild(messageEl)
  
  return {
    close: () => removeMessage(messageEl)
  }
}

// 快捷方法
Message.success = (message: string, duration?: number) => 
  Message({ message, type: 'success', duration })

Message.error = (message: string, duration?: number) => 
  Message({ message, type: 'error', duration })

Message.warning = (message: string, duration?: number) => 
  Message({ message, type: 'warning', duration })

Message.info = (message: string, duration?: number) => 
  Message({ message, type: 'info', duration })

// 消息确认框
export const MessageBox = {
  confirm: (options: MessageBoxOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      const { 
        title = '确认', 
        message, 
        type = 'warning',
        confirmButtonText = '确定',
        cancelButtonText = '取消',
        showCancelButton = true 
      } = options

      // 创建遮罩层
      const overlay = document.createElement('div')
      overlay.className = 'fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center animate-in fade-in duration-200'

      // 创建对话框
      const dialog = document.createElement('div')
      dialog.className = 'modal-box max-w-md animate-in zoom-in duration-200'
      
      dialog.innerHTML = `
        <h3 class="font-bold text-lg">${title}</h3>
        <p class="py-4">${message}</p>
        <div class="modal-action">
          ${showCancelButton ? `<button class="btn btn-outline" id="cancel-btn">${cancelButtonText}</button>` : ''}
          <button class="btn btn-primary" id="confirm-btn">${confirmButtonText}</button>
        </div>
      `

      overlay.appendChild(dialog)
      document.body.appendChild(overlay)

      // 事件处理
      const confirmBtn = dialog.querySelector('#confirm-btn')
      const cancelBtn = dialog.querySelector('#cancel-btn')

      const cleanup = () => {
        overlay.classList.add('animate-out', 'fade-out')
        setTimeout(() => overlay.remove(), 200)
      }

      confirmBtn?.addEventListener('click', () => {
        cleanup()
        resolve(true)
      })

      cancelBtn?.addEventListener('click', () => {
        cleanup()
        resolve(false)
      })

      // 点击遮罩层关闭
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup()
          resolve(false)
        }
      })
    })
  }
} 
 