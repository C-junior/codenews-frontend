import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: []
  }),

  getters: {
    activeNotifications: (state) => state.notifications.filter(n => n.visible)
  },

  actions: {
    /**
     * Adiciona uma notificação
     * @param {Object} notification - Dados da notificação
     * @param {string} notification.type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {string} notification.message - Mensagem da notificação
     * @param {boolean} notification.autoClose - Se deve fechar automaticamente
     * @param {number} notification.duration - Duração em ms (padrão: 3000)
     */
    addNotification({ type, message, autoClose = true, duration = 3000 }) {
      const id = Date.now() + Math.random()
      
      const notification = {
        id,
        type,
        message,
        autoClose,
        duration,
        visible: true,
        createdAt: new Date()
      }

      this.notifications.push(notification)

      // Auto-close para notificações de sucesso
      if (autoClose && type === 'success') {
        setTimeout(() => {
          this.removeNotification(id)
        }, duration)
      }

      return id
    },

    /**
     * Remove uma notificação
     * @param {number} id - ID da notificação
     */
    removeNotification(id) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    /**
     * Limpa todas as notificações
     */
    clearAll() {
      this.notifications = []
    },

    /**
     * Mostra notificação de sucesso (Verde Medicina)
     * @param {string} message - Mensagem de sucesso
     */
    showSuccess(message) {
      return this.addNotification({
        type: 'success',
        message,
        autoClose: true,
        duration: 3000
      })
    },

    /**
     * Mostra notificação de erro (dispensação manual)
     * @param {string} message - Mensagem de erro
     */
    showError(message) {
      return this.addNotification({
        type: 'error',
        message,
        autoClose: false // Requer dispensação manual
      })
    },

    /**
     * Mostra notificação de aviso
     * @param {string} message - Mensagem de aviso
     */
    showWarning(message) {
      return this.addNotification({
        type: 'warning',
        message,
        autoClose: true,
        duration: 5000
      })
    },

    /**
     * Mostra notificação informativa
     * @param {string} message - Mensagem informativa
     */
    showInfo(message) {
      return this.addNotification({
        type: 'info',
        message,
        autoClose: true,
        duration: 4000
      })
    }
  }
})