// WebSocketService.ts

import { Message, SeenNotification, TypingNotification } from '../interfaces/Discussion'
import { ErrorResponse } from '../interfaces/ErrorResponse'

export class WebSocketService {
    private static instance: WebSocketService | null = null
    private webSocket: WebSocket | null = null
    private onMessageCallback: (message: Message) => void = () => {}
    private onErrorCallback: (error: ErrorResponse) => void = () => {}
    private onCloseCallback: () => void = () => {}

    constructor(private url: string, private userId: string) {}

    public static getInstance(url: string, userId: string): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService(url, userId)
        }
        return WebSocketService.instance
    }
    
    connect(): void {
        if (this.webSocket) {
            //console.warn('WebSocket is already connected')
            return
        }

        this.webSocket = new WebSocket(`${this.url}?userId=${this.userId}`)

        this.webSocket.onopen = () => {
            console.log('WebSocket connection established', this.webSocket, this.url, this.userId)
        }

        this.webSocket.onmessage = (event) => {
            //console.log('Raw message received:', event.data)
            try {
                const parsedMessage = JSON.parse(event.data)
                //console.log('Parsed message:', parsedMessage)
                this.onMessageCallback(parsedMessage)
            } catch (error) {
                console.error('Failed to parse message:', error)
            }
        }

        this.webSocket.onerror = (event) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const error = event as any
            console.error('WebSocket error:', error || 'Unknown error')
            this.onErrorCallback({ error: error || 'WebSocket error', statusCode: 500 })
        }

        this.webSocket.onclose = () => {
            console.log('WebSocket connection closed')
            this.onCloseCallback()
            this.webSocket = null // Reset the WebSocket instance
        }
    }

    send(message: Message | TypingNotification |SeenNotification): void {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            //console.log('Sending message:', message)
            this.webSocket.send(JSON.stringify(message))
        } else {
            console.error('WebSocket is not connected or not in OPEN state')
        }
    }

    onMessage(callback: (message: Message | TypingNotification | SeenNotification) => void): void {
        if (this.webSocket) {
            this.webSocket.onmessage = (event: MessageEvent) => {
                console.log('Raw message received:', event.data)
                try {
                    const parsedMessage = JSON.parse(event.data)
    
                    // Check the type of message
                    if (parsedMessage.type === 'typing') {
                        console.log('Typing notification received:', parsedMessage)
                        callback(parsedMessage as TypingNotification)
                    }else if 
                        (parsedMessage.type === 'seen') {
                            console.log('Seen notification received:', parsedMessage)
                            callback(parsedMessage as SeenNotification)
                        }
                        else {
                            console.log('Standard message received:', parsedMessage)
                            callback(parsedMessage as Message)
                        }

                } catch (error) {
                    console.error('Failed to parse message:', error)
                }
            }
        }
    }
    

    // onTypingNotification(callback: (notification: { senderId: string }) => void): void {
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     this.onMessageCallback = (message: any) => {
    //         if (message.type === 'typing') {
    //             console.log('Typing notification from the service:', message)
    //             callback(message)
    //         } else {
    //             this.onMessageCallback(message) // Forward other messages
    //         }
    //     }
    // }

    onError(callback: (error: ErrorResponse) => void): void {
        this.onErrorCallback = callback
    }

    onClose(callback: () => void): void {
        this.onCloseCallback = callback
    }

    disconnect(): void {
        if (this.webSocket) {
            this.webSocket.close()
            this.webSocket = null
        }
    }
}
