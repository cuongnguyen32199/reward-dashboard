declare module 'http' {
  interface IncomingMessage {
    $user?: any
  }

  namespace Express {
    export interface Request {
      $user: any
      $source?: string
    }
  }
}
