import { OsintFeed, Alert } from '../types/index'

type WebSocketCallback = (data: OsintFeed | Alert) => void

export class WebSocketService {
  private ws: WebSocket | null = null
  private url: string
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 3000
  private callbacks: WebSocketCallback[] = []
  private isConnected = false

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('[WebSocket] Connected')
          this.isConnected = true
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.callbacks.forEach(callback => callback(data))
          } catch (err) {
            console.error('[WebSocket] Error parsing message:', err)
          }
        }

        this.ws.onerror = (error) => {
          console.error('[WebSocket] Error:', error)
          this.isConnected = false
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('[WebSocket] Disconnected')
          this.isConnected = false
          this.attemptReconnect()
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`[WebSocket] Attempting reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`)

      setTimeout(() => {
        this.connect().catch(err => {
          console.error('[WebSocket] Reconnect failed:', err)
        })
      }, delay)
    }
  }

  subscribe(callback: WebSocketCallback): () => void {
    this.callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback)
    }
  }

  send(data: any): void {
    if (this.ws && this.isConnected) {
      this.ws.send(JSON.stringify(data))
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
      this.isConnected = false
      this.callbacks = []
    }
  }

  isReady(): boolean {
    return this.isConnected && this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Create a singleton instance
export const wsService = new WebSocketService()
