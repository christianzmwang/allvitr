declare module 'stream-json/Parser' {
  export function parser(options?: Record<string, unknown>): NodeJS.ReadableStream;
}

declare module 'stream-json/streamers/StreamArray' {
  export function streamArray(): NodeJS.ReadableStream;
}


