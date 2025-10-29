<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <NotificationToast
      v-for="notification in activeNotifications"
      :key="notification.id"
      :show="notification.visible"
      :type="notification.type"
      :message="notification.message"
      :auto-close="notification.autoClose"
      :duration="notification.duration"
      @close="removeNotification(notification.id)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNotificationStore } from '@/stores/notification'
import NotificationToast from './NotificationToast.vue'

const notificationStore = useNotificationStore()

const activeNotifications = computed(() => notificationStore.activeNotifications)

const removeNotification = (id) => {
  notificationStore.removeNotification(id)
}
</script>
</template>