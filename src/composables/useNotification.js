import { useNotificationStore } from '@/stores/notification'

/**
 * Composable para gerenciar notificações
 * @returns {Object} Métodos para exibir notificações
 */
export function useNotification() {
  const notificationStore = useNotificationStore()

  /**
   * Exibe notificação de sucesso (Verde Medicina)
   * Auto-dispensada após 3 segundos
   * @param {string} message - Mensagem de sucesso
   */
  const showSuccess = (message) => {
    return notificationStore.showSuccess(message)
  }

  /**
   * Exibe notificação de erro
   * Requer dispensação manual
   * @param {string} message - Mensagem de erro
   */
  const showError = (message) => {
    return notificationStore.showError(message)
  }

  /**
   * Exibe notificação de aviso
   * Auto-dispensada após 5 segundos
   * @param {string} message - Mensagem de aviso
   */
  const showWarning = (message) => {
    return notificationStore.showWarning(message)
  }

  /**
   * Exibe notificação informativa
   * Auto-dispensada após 4 segundos
   * @param {string} message - Mensagem informativa
   */
  const showInfo = (message) => {
    return notificationStore.showInfo(message)
  }

  /**
   * Remove uma notificação específica
   * @param {number} id - ID da notificação
   */
  const removeNotification = (id) => {
    return notificationStore.removeNotification(id)
  }

  /**
   * Limpa todas as notificações
   */
  const clearAll = () => {
    return notificationStore.clearAll()
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification,
    clearAll
  }
}