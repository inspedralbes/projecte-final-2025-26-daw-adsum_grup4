import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import AttendanceStats from './AttendanceStats.vue';

const mockStats = {
  percentatge: 85,
  ratxa: 5,
  absents: 2,
  presents: 17,
  total: 20
};

const mockRecents = [
  { modul: 'M04', data: '2026-05-10', hora: '10:00:00', estat: 'present' },
  { modul: 'M04', data: '2026-05-08', hora: '10:00:00', estat: 'present' },
  { modul: 'M03', data: '2026-05-07', hora: '09:00:00', estat: 'absent' }
];

describe('AttendanceStats', () => {
  it('renders loading state initially', async () => {
    const wrapper = mount(AttendanceStats);
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.text()).toContain('Carregant dades');
  });

  it('displays stats after loading', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stats: mockStats, recents: mockRecents })
    });

    const wrapper = mount(AttendanceStats);
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.stats.percentatge).toBe(85);
    expect(wrapper.vm.error).toBeNull();
  });

  it('displays error when fetch fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const wrapper = mount(AttendanceStats);
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.vm.loading).toBe(false);
    expect(wrapper.vm.error).toBeTruthy();
  });

  it('shows correct color classes based on percentage', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stats: mockStats, recents: mockRecents })
    });

    const wrapper = mount(AttendanceStats);
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    const progressBar = wrapper.find('.bg-emerald-500');
    expect(progressBar.exists()).toBe(true);
  });

  it('displays recent attendance history', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ stats: mockStats, recents: mockRecents })
    });

    const wrapper = mount(AttendanceStats);
    await wrapper.vm.$nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(wrapper.vm.recents.length).toBe(3);
  });
});