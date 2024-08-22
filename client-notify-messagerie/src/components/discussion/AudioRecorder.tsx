import { Mic, StopCircle } from 'lucide-react'
import React, { useState, useRef } from 'react'

const AudioRecorder: React.FC<{ onSend: (blob: Blob) => void }> = ({ onSend }) => {
    const [recording, setRecording] = useState(false)
    const mediaRecorderRef = useRef<MediaRecorder | null>(null)
    const [audioUrl, setAudioUrl] = useState<string | null>(null)

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const mediaRecorder = new MediaRecorder(stream)

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    const blob = new Blob([event.data], { type: 'audio/wav' })
                    setAudioUrl(URL.createObjectURL(blob))
                    onSend(blob)
                }
            }

            mediaRecorder.start()
            mediaRecorderRef.current = mediaRecorder
            setRecording(true)
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
                onClick={recording ? stopRecording : startRecording}>
                {recording ? (

                    <StopCircle className='w-4 h-4 text-red-600 cursor-pointer dark:text-red-600 dark:hover:text-red-600' />

                ) : (<Mic className='w-4 h-4 text-blue-600 cursor-pointer dark:text-gray-400 dark:hover:text-white' />
                )}

            </button>
            {audioUrl && <audio controls src={audioUrl} />}



        </div>
    )
}

export default AudioRecorder
