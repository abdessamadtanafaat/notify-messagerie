/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorResponse } from '../interfaces'
import { Message, TypingNotification } from '../interfaces/Discussion'

export class WebSocketService {
    private webSocket: WebSocket | null = null
    private onMessageCallback: (message: Message) => void  =() => {}
    //private onTypingNotificationCallback: (typingNotification: TypingNotification) => void = () => {}
    private onErrorCallback: (error: ErrorResponse) => void =() => {}
    private onCloseCallback: () => void =() => {}

    constructor(private url: string, private userId: string){
        this.url = url
        this.userId = userId
    }
    
    connect(): void {
        this.webSocket = new WebSocket(`${this.url}?userId=${this.userId}`)

        this.webSocket.onopen = () => {
            console.log('web socket connection established', this.webSocket,this.url, this.userId)
        }

        this.webSocket.onmessage = (event) => {
            console.log('Raw message received:', event.data) 
            try {
                const parsedMessage = JSON.parse(event.data)
                console.log('Parsed message:', parsedMessage)
                this.onMessageCallback(parsedMessage)

                // Check message type
                // if (parsedMessage.type === 'typing') {
                //     // Handle typing notification
                //     if (parsedMessage.userId !== this.userId) {
                //         console.log('Typing notification received:', parsedMessage)
                //         // Update UI to show typing indicator
                //     }
                // } else {
                //     // Handle other messages
                //     this.onMessageCallback(parsedMessage)
                // }
            } catch (error) {
                console.log('Failed to parse message:', error)
            }
        }
        
        this.webSocket.onerror = (event) => {
            const error = event as any
            this.onErrorCallback({error:error.message || 'Web socket error', statusCode: 500 })
        }
        this.webSocket.onclose = () => {
            this.onCloseCallback()
        }
    }

    // send(message: Message | TypingNotification): void {
    //     if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
    //         this.webSocket.send(JSON.stringify(message))
    //     } else {
    //         console.error('WebSocket is not connected')
    //     }
    // }

    send(message: Message): void {
        if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
            this.webSocket.send(JSON.stringify(message))
        } else {
            console.error('WebSocket is not connected')
        }
    }

    onMessage(callback: (messag: Message)=> void):void{
        this.onMessageCallback = callback
    }

    // onTypingNotification(callback: (typingNotification: TypingNotification) => void): void {
    //     this.onTypingNotificationCallback = callback
    // }

    onError(callback: (error: ErrorResponse)=> void): void {
        this.onErrorCallback = callback
    }
    onClose(callback: ()=> void): void {
        this.onCloseCallback = callback
    }

    disconnect(): void {
        if(this.webSocket) {
            this.webSocket.close()
        }
    }
}