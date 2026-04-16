import { useEffect, useCallback } from 'react'
import { wsService } from '../services/websocket'
import { OsintFeed, Alert } from '../types/index'

type WebSocketData = OsintFeed | Alert

export const useWebSocket = (
  onMessage: (data: WebSocketData) => void,
  autoConnect = false
) => {
  const connect = useCallback(async () => {
    try {
      if (!wsService.isReady()) {
        await wsService.connect()
      }
    } catch (err) {
      console.error('[useWebSocket] Connection failed:', err)
      // Graceful fallback - app will use polling instead
    }
  }, [])

  const disconnect = useCallback(() => {
    wsService.disconnect()
  }, [])

  const send = useCallback((data: any) => {
    wsService.send(data)
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    const unsubscribe = wsService.subscribe(onMessage)

    return () => {
      unsubscribe()
      if (autoConnect) {
        disconnect()
      }
    }
  }, [onMessage, autoConnect, connect, disconnect])

  return {
    connect,
    disconnect,
    send,
    isConnected: wsService.isReady(),
  }
}
