import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import { App } from '../src/App';

describe('App Sidebar Collapse', () => {
  it('renders without crashing', () => {
    const html = renderToString(<App />);
    expect(html).toContain('platform-sidebar');
  });

  it('renders collapsed class when localStorage has true', () => {
    const store: Record<string, string> = { geniusphere_sidebar_collapsed: 'true' };
    global.localStorage = {
      getItem: (k: string) => store[k] || null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
      clear: () => {},
      length: 1,
      key: () => null,
    } as any;

    const html = renderToString(<App />);
    expect(html).toContain('platform-sidebar');
    expect(html).toContain('collapsed');
    expect(html).toContain('width:72px');
    expect(html).toContain('min-width:72px');
    expect(html).toContain('max-width:72px');
    expect(html).not.toContain('<span class="sidebar-label">Landing Page</span>');
    expect(html).not.toContain('<span class="sidebar-label">Courses</span>');
    expect(html).not.toContain('For Institutions');
    expect(html).toContain('Expand Sidebar (⌘+B)');
  });
});
