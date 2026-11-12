import { fetch } from 'expo/fetch'

import { Logger } from '@lib/state/Logger'

type SSEValues = {
    endpoint: string
    method: 'POST' | 'GET'
    body: string
    headers: any
}

export class SSEFetch {
    private abortController: AbortController = new AbortController()
    private decoder = new TextDecoder()
    private onEvent = (data: string) => {}
    private onError = () => {}
    private onClose = () => {}
    private closeStream = () => {}
    private cancelled = false
    private buffer = ''
    public abort() {
        this.abortController.abort()

        this.closeStream()
        this.closeStream = () => {
            this.cancelled = true
        }
    }

    public async start(values: SSEValues) {
        this.abortController = new AbortController()
        const body = values.method === 'POST' ? { body: values.body } : {}
        this.cancelled = false
        this.buffer = ''
        try {
            const res = await fetch(values.endpoint, {
                signal: this.abortController.signal,
                method: values.method,
                headers: values.headers,
                ...body,
            })
            if (res.status !== 200 || !res.body) {
                Logger.error('Status ' + res.status)
                Logger.error(await res.text())
                return this.onError()
            }
            const reader = res.body.getReader()
            this.closeStream = () => {
                try {
                    reader.cancel()
                    this.cancelled = true
                } catch {}
            }
            while (true) {
                const { value, done } = await reader.read()
                if (done || this.cancelled) break

                this.buffer += this.decoder.decode(value, { stream: true })
                const lastNewline = this.buffer.lastIndexOf('\n')
                if (lastNewline === -1) continue
                const complete = this.buffer.slice(0, lastNewline)
                this.buffer = this.buffer.slice(lastNewline + 1)
                parseSSE(complete).forEach((item) => this.onEvent(item))
            }
            if (this.buffer.trim() && !this.cancelled) {
                const rest = this.buffer
                this.buffer = ''
                parseSSE(rest).forEach((item) => this.onEvent(item))
            }
        } catch (e) {
            if (this.abortController.signal.aborted) {
                Logger.debug('Abort caught')
            }
            Logger.error('Request Failed: ' + e)
        } finally {
            this.onClose()
        }
    }

    public setOnEvent(callback: (data: string) => void) {
        this.onEvent = callback
    }

    public setOnError(callback: () => void) {
        this.onError = callback
    }

    public setOnClose(callback: () => void) {
        this.onClose = callback
    }
}

function parseSSE(message: string) {
    const output: string[] = []
    const lines = message.split(/\n/)
    for (const line of lines) {
        // For some APIs like Ollama, they use a ndjson stream
        if (line.startsWith('{')) {
            try {
                JSON.parse(line)
                output.push(line)
            } catch {
                continue
            }
        }
        const colonIndex = line.indexOf(':')
        if (colonIndex === 0) continue
        const field = colonIndex > 0 ? line.slice(0, colonIndex).trim() : line.trim()
        const value = colonIndex > 0 ? line.slice(colonIndex + 1).trim() : ''
        if (field !== 'data' || value.startsWith('[DONE]')) continue
        output.push(value)
    }

    return output
}
