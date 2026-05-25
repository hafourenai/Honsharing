"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { MicVAD } from "@ricky0123/vad-web"

export type VoiceStatus = "idle" | "listening" | "speaking" | "processing" | "error"

interface UseVoiceChatOptions {
  onSend: (text: string) => void
  stopAiSpeech: () => void
}

export function useVoiceChat({ onSend, stopAiSpeech }: UseVoiceChatOptions) {
  const [status, setStatus] = useState<VoiceStatus>("idle")
  const [error, setError] = useState<string | null>(null)

  const onSendRef = useRef(onSend)
  const stopAiSpeechRef = useRef(stopAiSpeech)

  useEffect(() => { onSendRef.current = onSend }, [onSend])
  useEffect(() => { stopAiSpeechRef.current = stopAiSpeech }, [stopAiSpeech])

  const streamRef = useRef<MediaStream | null>(null)
  const vadRef = useRef<Awaited<ReturnType<typeof MicVAD.new>> | null>(null)
  const processingRef = useRef(false)
  const destroyedRef = useRef(false)

  const transcribe = useCallback(async (blob: Blob): Promise<string | null> => {
    if (blob.size === 0) return null
    try {
      const formData = new FormData()
      formData.append("audio", blob, "recording.wav")
      const res = await fetch("/api/stt", { method: "POST", body: formData })
      if (res.ok) {
        const data = await res.json()
        return data.transcript?.trim() || null
      }
      return null
    } catch {
      return null
    }
  }, [])

  const start = useCallback(async () => {
    if (status !== "idle") return

    try {
      destroyedRef.current = false
      processingRef.current = false

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const vad = await MicVAD.new({
        onSpeechStart: () => {
          if (processingRef.current || destroyedRef.current) return
          stopAiSpeechRef.current()
          setStatus("speaking")
        },
        onSpeechEnd: async (audio: Float32Array) => {
          if (processingRef.current || destroyedRef.current) return

          processingRef.current = true
          setStatus("processing")

          try {
            const blob = encodePCMToWav(audio)
            const transcript = await transcribe(blob)
            if (!destroyedRef.current && transcript) {
              onSendRef.current(transcript)
            }
          } finally {
            processingRef.current = false
            if (!destroyedRef.current) {
              setStatus("listening")
            }
          }
        },
        getStream: () => Promise.resolve(stream),
        startOnLoad: false,
        baseAssetPath: "/vad/",
        onnxWASMBasePath: "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.26.0/dist/",
        redemptionMs: 1000,
        preSpeechPadMs: 300,
        minSpeechMs: 300,
        positiveSpeechThreshold: 0.5,
        negativeSpeechThreshold: 0.35,
      })

      if (destroyedRef.current) {
        stream.getTracks().forEach(t => t.stop())
        return
      }

      vadRef.current = vad
      await vad.start()
      setStatus("listening")
    } catch (err) {
      if (destroyedRef.current) return
      const msg =
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Akses mikrofon ditolak"
          : err instanceof Error
            ? err.message
            : "Gagal menginisialisasi VAD"
      setError(msg)
      setStatus("error")
    }
  }, [status, transcribe])

  const stop = useCallback(() => {
    destroyedRef.current = true

    if (vadRef.current) {
      vadRef.current.destroy().catch(() => {})
      vadRef.current = null
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }

    processingRef.current = false
    setStatus("idle")
    setError(null)
  }, [])

  useEffect(() => {
    return () => { stop() }
  }, [stop])

  return { status, error, start, stop }
}

function encodePCMToWav(float32Array: Float32Array): Blob {
  const numChannels = 1
  const sampleRate = 16000
  const bitsPerSample = 16
  const byteRate = sampleRate * numChannels * bitsPerSample / 8
  const blockAlign = numChannels * bitsPerSample / 8
  const dataSize = float32Array.length * bitsPerSample / 8
  const headerSize = 44
  const totalSize = headerSize + dataSize

  const buffer = new ArrayBuffer(totalSize)
  const view = new DataView(buffer)

  writeString(view, 0, "RIFF")
  view.setUint32(4, totalSize - 8, true)
  writeString(view, 8, "WAVE")
  writeString(view, 12, "fmt ")
  view.setUint32(16, 16, true)
  view.setUint16(20, 1, true)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitsPerSample, true)
  writeString(view, 36, "data")
  view.setUint32(40, dataSize, true)

  let offset = 44
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true)
    offset += 2
  }

  return new Blob([buffer], { type: "audio/wav" })
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i))
  }
}
