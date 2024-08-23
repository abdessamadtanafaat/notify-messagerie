import { Loader, Mic, StopCircle } from 'lucide-react'
import React, { useState, useRef } from 'react'
import { User } from '../../interfaces'


interface AudioRecorderProps {
    onSend: (blob: Blob) => Promise<void>;
    sendRecordingNotification: (discussionId: string, receiver: User) => void;
    lastMessage: { discussionId: string };
    receiver: User;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSend, sendRecordingNotification, lastMessage, receiver }) => {
    const [recording, setRecording] = useState(false)
    const [sending, setSending] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    const blob = new Blob([event.data], { type: 'audio/wav' })
                    setAudioUrl(URL.createObjectURL(blob))
                    setRecording(false)
                    setSending(true)
                    try {
                        await onSend(blob)
                    } finally {
                        setSending(false)
                        setAudioUrl(null)
                    }


                }
            }

            mediaRecorder.start()
            mediaRecorderRef.current = mediaRecorder
            setRecording(true)
            sendRecordingNotification(lastMessage.discussionId, receiver) // Notify while recording
        }
    }

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop()
            setRecording(false)
        }
    }

    return (
        <div>
            <button
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                onClick={recording ? stopRecording : startRecording}
                disabled={sending}
            >
                {!recording && sending ? (
                    <Loader className='w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin' />
                ) : recording ? (
                    <StopCircle className='w-4 h-4 text-red-600 cursor-pointer dark:text-red-600 dark:hover:text-red-600' />
                ) : (
                    <Mic className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                )}

            </button>
            {audioUrl && !sending && <audio controls src={audioUrl} />}



        </div>
    )
}

export default AudioRecorder
