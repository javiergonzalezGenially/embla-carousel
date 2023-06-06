import { AxisType } from './Axis'
import { EmblaCarouselType } from './EmblaCarousel'
import { EventHandlerType } from './EventHandler'
import { isBoolean, WindowType } from './utils'

type ResizeHandlerCallbackType = (
  emblaApi: EmblaCarouselType,
  entries: ResizeObserverEntry[],
) => boolean | void

export type ResizeHandlerOptionType = boolean | ResizeHandlerCallbackType

export type ResizeHandlerType = {
  init: (
    emblaApi: EmblaCarouselType,
    watchResize: ResizeHandlerOptionType,
  ) => void
  destroy: () => void
}

export function ResizeHandler(
  container: HTMLElement,
  eventHandler: EventHandlerType,
  ownerWindow: WindowType,
  slides: HTMLElement[],
  axis: AxisType,
): ResizeHandlerType {
  let resizeObserver: ResizeObserver
  let containerSize: number
  let slideSizes: number[] = []
  let destroyed = false

  function readSize(node: Element | HTMLElement): number {
    return axis.measureSize(node.getBoundingClientRect())
  }

  function init(
    emblaApi: EmblaCarouselType,
    watchResize: ResizeHandlerOptionType,
  ): void {
    if (!watchResize) return

    containerSize = readSize(container)
    slideSizes = slides.map(readSize)

    function defaultCallback(entries: ResizeObserverEntry[]): void {
      for (const entry of entries) {
        const isContainer = entry.target === container
        const slideIndex = slides.indexOf(<HTMLElement>entry.target)
        const lastSize = isContainer ? containerSize : slideSizes[slideIndex]
        const newSize = readSize(isContainer ? container : slides[slideIndex])

        if (lastSize !== newSize) {
          ownerWindow.requestAnimationFrame(() => {
            emblaApi.reInit()
            eventHandler.emit('resize')
          })
          break
        }
      }
    }

    resizeObserver = new ResizeObserver((entries) => {
      if (destroyed) return
      if (isBoolean(watchResize) || watchResize(emblaApi, entries)) {
        defaultCallback(entries)
      }
    })

    const observeNodes = [container].concat(slides)
    observeNodes.forEach((node) => resizeObserver.observe(node))
  }

  function destroy(): void {
    if (resizeObserver) resizeObserver.disconnect()
    destroyed = true
  }

  const self: ResizeHandlerType = {
    init,
    destroy,
  }
  return self
}