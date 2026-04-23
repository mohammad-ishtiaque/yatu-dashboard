type LogLevel = 'info' | 'warn' | 'error' | 'debug'
interface LogPayload { [key: string]: unknown }

// Vite exposes env vars via import.meta.env, not process.env
// import.meta.env.DEV is true during `vite dev`, false in `vite build`
const isDev = import.meta.env.DEV
const COLORS: Record<LogLevel, string> = { info:'#3B82F6', warn:'#F59E0B', error:'#EF4444', debug:'#8B5CF6' }

function log(level: LogLevel, message: string, payload?: LogPayload): void {
  const timestamp = new Date().toISOString()
  if (isDev) {
    const color = COLORS[level]
    console.groupCollapsed(`%c[${level.toUpperCase()}]%c ${message}`, `color:${color};font-weight:bold`, 'color:inherit')
    if (payload && Object.keys(payload).length > 0) console.log(payload)
    console.groupEnd()
  } else {
    console[level](JSON.stringify({ timestamp, level, message, ...payload }))
  }
}

export const logger = {
  info:  (msg: string, payload?: LogPayload) => log('info',  msg, payload),
  warn:  (msg: string, payload?: LogPayload) => log('warn',  msg, payload),
  error: (msg: string, payload?: LogPayload) => log('error', msg, payload),
  debug: (msg: string, payload?: LogPayload) => log('debug', msg, payload),
}
