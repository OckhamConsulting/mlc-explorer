import { mount } from '@vue/test-utils'
import Meter from '@/components/Meter'

describe('Meter', () => {
  describe('when percentage is 0%', () => {
    it('the arc with colour should be hidden', () => {
      const wrapper = mount(Meter, { propsData: { percentage: 0 } })
      expect(wrapper.findAll('circle')).toHaveLength(1)
    })
  })

  describe('when percentage is bigger than 0%', () => {
    it('the arc with colour should be visible', () => {
      const wrapper = mount(Meter, { propsData: { percentage: 50 } })
      expect(wrapper.findAll('circle')).toHaveLength(2)
    })
  })
})
