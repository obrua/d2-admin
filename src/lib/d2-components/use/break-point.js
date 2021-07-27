import { computed } from 'vue'
import { keys, values, fromPairs } from 'lodash-es'
import { useWindowSize } from './window-size.js'
import { useConfig } from './config-inject'

/**
 * Get breakpoint status
 * @param {Object} breakPoints break point setting, if do not set this parameter, use global config
 * @returns {Object} status {String} breakPoint now active break point name
 * @returns {Object} status {String} ...breakPoints.keys active state of each breakpoint
 * @returns {Object} status {String} min less than the minimum breakpoint
 */
export function useBreakPoint (breakPoints) {
  const config = useConfig()
  
  const _breakPoints = breakPoints || config.breakPoints

  const names = keys(_breakPoints)
  const widths = values(_breakPoints).sort((a, b) => a - b)
  const dict = fromPairs(widths.map((e, i) => [e, names[i]]))

  const { width } = useWindowSize()

  const widthActive = computed(() => widths.reduce((r, e) => width.value >= e ? e : r, 0))

  const breakPoint = computed(() => dict[widthActive.value] || 'min')

  const isMin = computed(() => breakPoint.value === 'min')

  const status = fromPairs(names.map(e => [e, computed(() => breakPoint.value === e)]))

  /**
   * match values based on breakpoints
   * @param {*} value default value
   * @param {*} valueSet set of values matched by breakpoints
   * @returns a matched value
   */
  function responsive (value, valueSet = {}) {
    return computed(() => {
      const point = dict[
        Math.max(
          ...keys(valueSet)
            .map(e => _breakPoints[e])
            .filter(e => e <= widthActive.value)
        )
      ]
      return valueSet[point] || value
    })
  }

  return {
    responsive,
    breakPoint,
    min: isMin,
    ...status
  }
}
