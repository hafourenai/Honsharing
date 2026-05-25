"use client"

import { useState, useRef, useCallback, useEffect } from "react"

export type RecorderStatus = "idle" | "recording" | "stopping" | "error"

interface UseAudioRecorderReturn {
  status: RecorderStatus
  error: string | null
  duration: number
  startRecording: () => Promise<void>
  stopRecording: () => Promise<Blob>
}

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ]
  return types.find(t => MediaRecorder.isTypeSupported(t)) ?? ""
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [status, setStatus] = useState<RecorderStatus>("idle")
  const [error, setError] = useState<string | null>(null)
  const [duration, setDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setDuration(0)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const mimeType = getSupportedMimeType()
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onerror = () => {
        setError("Recording error occurred")
        setStatus("error")
      }

      recorder.start(250)
      setStatus("recording")

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Akses mikrofon ditolak"
          : err instanceof Error
            ? err.message
            : "Gagal memulai rekaman"
      setError(msg)
      setStatus("error")
    }
  }, [])

  const stopRecording = useCallback((): Promise<Blob> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current
      if (!recorder || recorder.state === "inactive") {
        resolve(new Blob())
        return
      }

      setStatus("stopping")
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      recorder.onstop = () => {
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        const type = recorder.mimeType || "audio/webm"
        const blob = new Blob(chunksRef.current, { type })
        chunksRef.current = []
        mediaRecorderRef.current = null
        setStatus("idle")
        resolve(blob)
      }

      recorder.stop()
    })
  }, [])

  return { status, error, duration, startRecording, stopRecording }
}
