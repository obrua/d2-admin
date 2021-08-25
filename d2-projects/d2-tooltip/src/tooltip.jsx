import {
  defineComponent,
  computed,
  Teleport
} from 'vue'
import makeClassnames from 'classnames'
import {
  usePopper
} from 'd2-projects/d2-use/popper.js'
import {
  makeComponentName,
  makeComponentClassName
} from 'd2-projects/d2-utils/special/d2-components/name.js'

const namespace = 'tooltip'

const name = makeComponentName(namespace)
const classname = makeComponentClassName(namespace)

export default defineComponent({
  name,
  setup (props, { slots }) {
    const {
      reference,
      pop
    } = usePopper()

    const classnames = computed(() => makeClassnames(classname, {}))

    return {
      reference,
      pop,
      classnames
    }
  },
  render () {
    return [
      this.$slots?.default?.(),
      <span ref="reference">reference</span>,
      (
        <Teleport to="body">
          <div ref="pop" class={ this.classnames }>Hello</div>
        </Teleport>
      )
    ]
  }
})