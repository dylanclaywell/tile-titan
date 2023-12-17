import mitt from 'mitt'

export type Events = {
  'reset-view': undefined
  // Please use this sparingly
  'redraw-layer': string
}

export const eventEmitter = mitt<Events>()
