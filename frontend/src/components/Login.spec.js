import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Login from './Login.vue';

describe('Login', () => {
  let wrapper;

  beforeEach(() => {
    localStorage.clear();
    wrapper = mount(Login);
  });

  it('renders login form correctly', () => {
    expect(wrapper.find('h1').text()).toBe('Benvingut');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows error message on failed login', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('wrongpassword');
    await wrapper.find('form').trigger('submit');

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.errorMessage).toBe('Credencials invàlides');
  });

  it('emits login-success on successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', rol: 'alumne' };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: 'mock-token',
        user: mockUser
      })
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('login-success')).toBeTruthy();
    expect(localStorage.getItem('access_token')).toBe('mock-token');
  });

  it('shows loading state during login', async () => {
    let resolveFetch;
    global.fetch = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveFetch = resolve;
      });
    });

    await wrapper.find('input[type="email"]').setValue('test@example.com');
    await wrapper.find('input[type="password"]').setValue('password123');
    await wrapper.find('form').trigger('submit');

    expect(wrapper.vm.isLoading).toBe(true);
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });
});