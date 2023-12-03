import EventEmitter from 'events'

export type TileTitanEventMap = {
  'reset-view': []
}

type TileTitanEvent = keyof TileTitanEventMap

class TileTitanEventEmitter extends EventEmitter {
  emit(event: TileTitanEvent, ...args: TileTitanEventMap[TileTitanEvent]): boolean {
    return super.emit(event, ...args)
  }

  on(event: TileTitanEvent, listener: (...args: TileTitanEventMap[TileTitanEvent]) => void): this {
    return super.on(event, listener)
  }
}

export const eventEmitter = new TileTitanEventEmitter()
