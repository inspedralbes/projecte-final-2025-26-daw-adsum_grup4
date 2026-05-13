import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GradeCalculator from './GradeCalculator.vue';

describe('GradeCalculator', () => {
  it('renders correctly with initial grades', () => {
    const wrapper = mount(GradeCalculator);
    
    expect(wrapper.vm.grades.length).toBe(2);
    expect(wrapper.vm.targetGrade).toBe(5);
  });

  it('adds a new grade', () => {
    const wrapper = mount(GradeCalculator);
    const initialLength = wrapper.vm.grades.length;
    
    wrapper.vm.addGrade();
    
    expect(wrapper.vm.grades.length).toBe(initialLength + 1);
  });

  it('removes a grade', () => {
    const wrapper = mount(GradeCalculator);
    const initialLength = wrapper.vm.grades.length;
    
    wrapper.vm.removeGrade(0);
    
    expect(wrapper.vm.grades.length).toBe(initialLength - 1);
  });

  it('calculates total weight correctly', () => {
    const wrapper = mount(GradeCalculator);
    
    expect(wrapper.vm.totalWeight).toBe(70);
  });

  it('calculates current average correctly', () => {
    const wrapper = mount(GradeCalculator);
    
    const expectedAverage = (4.5 * 40 + 6.2 * 30) / 70;
    expect(wrapper.vm.currentAverage).toBeCloseTo(expectedAverage, 2);
  });

  it('calculates needed grade for remaining weight', () => {
    const wrapper = mount(GradeCalculator);
    
    const remainingWeight = 30;
    const targetGrade = 5;
    const currentWeightedSum = 4.5 * 40 + 6.2 * 30;
    const expectedNeeded = (targetGrade * 100 - currentWeightedSum) / remainingWeight;
    
    expect(wrapper.vm.neededGrade).toBeCloseTo(expectedNeeded, 2);
  });

  it('shows "MATEMÀTICAMENT IMPOSSIBLE" when needed grade > 10', async () => {
    const wrapper = mount(GradeCalculator);
    
    wrapper.vm.targetGrade = 10;
    wrapper.vm.grades[0].value = 0;
    wrapper.vm.grades[0].weight = 40;
    wrapper.vm.grades[1].value = 0;
    wrapper.vm.grades[1].weight = 30;
    
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.neededGrade).toBeGreaterThan(10);
  });

  it('updates grade values reactively', async () => {
    const wrapper = mount(GradeCalculator);
    
    wrapper.vm.grades[0].value = 8;
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.currentAverage).toBeGreaterThan(5);
  });
});