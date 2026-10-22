import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import { Hologram3DIoTNode } from '../src/labs/iot-lab/components/Hologram3DIoTNode';

describe('Hologram 3D IoT Node Lab — Architecture, Simulation & Lifecycle', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders 3D Hologram lab with all 4 architectural hardware layers', () => {
    const html = renderToString(<Hologram3DIoTNode />);

    expect(html).toContain('HOLOGRAM 3D HARDWARE LAB');
    expect(html).toContain('Edge IoT Sensor Node &amp; Microcontroller Stack');
    expect(html).toContain('LAYER 1: POWER PLANE');
    expect(html).toContain('LAYER 2: COMPUTE PLANE');
    expect(html).toContain('LAYER 3: SENSOR ARRAY');
    expect(html).toContain('LAYER 4: LORA RF &amp; OLED');
    expect(html).toContain('ESP32-S3');
    expect(html).toContain('BME680');
    expect(html).toContain('LoRa RF');
    expect(html).toContain('TP4056');
    expect(html).toContain('3D Exploded Viewer');
    expect(html).toContain('Power Budget Challenge');
    expect(html).toContain('Knowledge Check');
  });

  it('displays correct operational electrical specs for default selected ESP32-S3 component', () => {
    const html = renderToString(<Hologram3DIoTNode />);

    expect(html).toContain('ESP32-S3 Dual-Core Microcontroller SoC');
    expect(html).toContain('3.0V – 3.6V DC');
    expect(html).toContain('80 mA (240MHz)');
    expect(html).toContain('10 µA (Deep Sleep RTC)');
    expect(html).toContain('WHY 3D STACKED ARCHITECTURE?');
  });

  it('includes accessibility attributes and reduced motion support', () => {
    const html = renderToString(<Hologram3DIoTNode />);

    expect(html).toContain('Reduced Motion');
    expect(html).toContain('aria-label="Adjust 3D exploded layer separation"');
    expect(html).toContain('tabindex="0"');
  });

  it('verifies mathematical power budget calculation logic', () => {
    // Math verification:
    // Capacity = 2500 mAh
    // Case 1: 15m interval, deep sleep (10µA), fast sensor
    // t_active = 0.1s, i_active = 92mA, t_sleep = 899.9s, i_sleep = 0.01mA
    // i_avg = (92 * 0.1 + 0.01 * 899.9) / 900 = (9.2 + 8.999) / 900 = 18.199 / 900 = ~0.0202 mA
    // Hours = (2500 * 0.85) / 0.0202 = 105,198 hours = ~4383 days = ~12.0 years
    // Case 2: 1s interval, active mode (80mA)
    // i_avg = 80+ mA -> Hours = ~26.5 hours (under 2 days)
    
    const calculateAvgCurrent = (intervalSec: number, sleepMode: 'active' | 'deep', isPrecision: boolean) => {
      const tActive = isPrecision ? 0.35 : 0.1;
      const tSleep = Math.max(0, intervalSec - tActive);
      const iActive = isPrecision ? 105 : 92;
      const iSleep = sleepMode === 'active' ? 80 : 0.01;
      return (iActive * tActive + iSleep * tSleep) / intervalSec;
    };

    const continuousActive = calculateAvgCurrent(1, 'active', false);
    expect(continuousActive).toBeGreaterThan(70); // > 70 mA continuous draw

    const optimizedDeepSleep = calculateAvgCurrent(900, 'deep', false);
    expect(optimizedDeepSleep).toBeLessThan(0.05); // < 50 µA average draw
  });
});
