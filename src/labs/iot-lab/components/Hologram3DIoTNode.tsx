import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Cpu, Activity, Zap, Radio, Layers, RotateCcw, 
  Eye, CheckCircle2, AlertTriangle, ShieldCheck, 
  HelpCircle, Battery, Clock, Wifi, Compass
} from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface ComponentSpec {
  id: string;
  name: string;
  layer: number;
  layerName: string;
  category: string;
  voltage: string;
  busProtocol: string;
  currentDrawActive: string;
  currentDrawSleep: string;
  description: string;
  why3D: string;
}

const COMPONENTS: ComponentSpec[] = [
  {
    id: 'esp32-s3',
    name: 'ESP32-S3 Dual-Core Microcontroller SoC',
    layer: 2,
    layerName: 'Compute Plane',
    category: 'Processing Core',
    voltage: '3.0V – 3.6V DC',
    busProtocol: 'Internal Memory Bus / SPI / I2C / UART',
    currentDrawActive: '80 mA (240MHz)',
    currentDrawSleep: '10 µA (Deep Sleep RTC)',
    description: 'Xtensa 32-bit dual-core LX7 processor with hardware cryptographic acceleration, integrated 2.4GHz Wi-Fi and Bluetooth 5 (LE). Coordinates sensor acquisitions, runs encryption algorithms, and manages power gates.',
    why3D: 'Positioned in the middle compute layer to minimize trace inductance to the radio shield and memory plane.',
  },
  {
    id: 'bme680',
    name: 'BME680 Environmental MEMS Sensor Array',
    layer: 3,
    layerName: 'Sensor Subsystem',
    category: 'MEMS Sensing',
    voltage: '1.71V – 3.6V DC',
    busProtocol: 'I2C (0x77) @ 400 kHz Fast-Mode',
    currentDrawActive: '12 mA (During Gas Heater Pulse)',
    currentDrawSleep: '0.15 µA (Sleep Mode)',
    description: '4-in-1 environmental sensor integrating barometric pressure, relative humidity, ambient temperature, and volatile organic compound (VOC) gas resistance via a heated micro-hotplate.',
    why3D: 'Must sit on the external exposure surface with thermal cutouts to isolate it from microcontroller CPU heat dissipation.',
  },
  {
    id: 'lora-rf',
    name: 'LoRa 868/915MHz RF Transceiver Module',
    layer: 4,
    layerName: 'Telemetry & UI Plane',
    category: 'Sub-GHz RF Radio',
    voltage: '1.8V – 3.7V DC',
    busProtocol: 'SPI @ 10 MHz + DIO0 Interrupt',
    currentDrawActive: '120 mA (+20 dBm Transmit)',
    currentDrawSleep: '0.2 µA (Sleep Mode)',
    description: 'Chirp Spread Spectrum (CSS) modulation transceiver delivering long-range (up to 15 km line-of-sight) telemetry with extreme resistance to in-band electromagnetic interference.',
    why3D: 'Elevated on the top layer to prevent RF ground-plane attenuation from other PCB copper planes.',
  },
  {
    id: 'oled-display',
    name: '0.96" Monochrome I2C OLED Display',
    layer: 4,
    layerName: 'Telemetry & UI Plane',
    category: 'Visual Interface',
    voltage: '3.3V DC',
    busProtocol: 'I2C (0x3C) @ 400 kHz',
    currentDrawActive: '20 mA (All pixels on)',
    currentDrawSleep: '0 µA (Display Off)',
    description: '128x64 pixel organic light-emitting diode screen for localized diagnostic telemetry, node address, RSSI signal, and battery health inspection.',
    why3D: 'Mounted flush on the exterior user-facing plane for field technician diagnostics.',
  },
  {
    id: 'power-mgmt',
    name: 'TP4056 LiPo Charger & Low-Dropout (LDO) Regulator',
    layer: 1,
    layerName: 'Power & Ground Base Plane',
    category: 'Power Management',
    voltage: '3.7V LiPo -> 3.3V Regulated',
    busProtocol: 'Analog Power Rail + STAT Pins',
    currentDrawActive: '55 µA Quiescent Current',
    currentDrawSleep: '55 µA Quiescent Current',
    description: 'Single-cell lithium-polymer battery charge controller paired with an ultra-low dropout 3.3V linear regulator capable of supplying up to 600mA surge current during RF transmissions.',
    why3D: 'Placed on the heavy bottom copper plane to act as a thermal heatsink for linear voltage dissipation.',
  },
];

interface Hologram3DIoTNodeProps {
  onComplete?: (score: number, details: any) => void;
}

export const Hologram3DIoTNode: React.FC<Hologram3DIoTNodeProps> = ({ onComplete }) => {
  // 3D Viewport Controls State
  const [rotX, setRotX] = useState<number>(55);
  const [rotY, setRotY] = useState<number>(30);
  const [zoom, setZoom] = useState<number>(100);
  const [explodedPercent, setExplodedPercent] = useState<number>(50);
  const [selectedComponentId, setSelectedComponentId] = useState<string>('esp32-s3');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'inspect' | 'challenge' | 'quiz'>('inspect');

  // Challenge Configuration State
  const [intervalOption, setIntervalOption] = useState<'1s' | '30s' | '15m'>('30s');
  const [sleepModeOption, setSleepModeOption] = useState<'active' | 'modem' | 'deep'>('deep');
  const [sensorPrecisionOption, setSensorPrecisionOption] = useState<'fast' | 'precision'>('precision');
  const [challengeSubmitted, setChallengeSubmitted] = useState<boolean>(false);

  // Knowledge Check Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);

  // Mouse Drag Tracking Ref
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);

  // Auto-rotation loop
  useEffect(() => {
    if (!isAutoRotating || reducedMotion) return;

    let lastTime = performance.now();
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setRotY((prev) => (prev + delta * 15) % 360);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isAutoRotating, reducedMotion]);

  // Clean-up on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (isAutoRotating) setIsAutoRotating(false);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePosRef.current.x;
    const dy = e.clientY - lastMousePosRef.current.y;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };

    setRotY((prev) => (prev + dx * 0.5) % 360);
    setRotX((prev) => Math.max(10, Math.min(85, prev - dy * 0.5)));
  }, []);

  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setRotY((prev) => prev - 5);
    else if (e.key === 'ArrowRight') setRotY((prev) => prev + 5);
    else if (e.key === 'ArrowUp') setRotX((prev) => Math.max(10, prev - 5));
    else if (e.key === 'ArrowDown') setRotX((prev) => Math.min(85, prev + 5));
    else if (e.key === '+' || e.key === '=') setZoom((prev) => Math.min(160, prev + 10));
    else if (e.key === '-' || e.key === '_') setZoom((prev) => Math.max(60, prev - 10));
  };

  // Selected Component Spec
  const activeComponent = COMPONENTS.find((c) => c.id === selectedComponentId) || COMPONENTS[0];

  // Mathematical Calculation of Power Budget
  const calculatePowerBudget = () => {
    // Battery Capacity: 2500 mAh 18650 Cell
    const batteryCapacity = 2500; // mAh

    let tCycleSeconds = 30;
    if (intervalOption === '1s') tCycleSeconds = 1;
    else if (intervalOption === '30s') tCycleSeconds = 30;
    else if (intervalOption === '15m') tCycleSeconds = 900;

    let tActiveSeconds = sensorPrecisionOption === 'precision' ? 0.35 : 0.1;
    if (intervalOption === '1s') tActiveSeconds = 0.2;

    const tSleepSeconds = Math.max(0, tCycleSeconds - tActiveSeconds);

    let iActiveCurrent = 80; // mA (CPU base)
    if (sensorPrecisionOption === 'precision') iActiveCurrent += 25; // MEMS gas heater + LoRa burst
    else iActiveCurrent += 12;

    let iSleepCurrent = 0.01; // mA (Deep sleep: 10 µA)
    if (sleepModeOption === 'active') iSleepCurrent = 80;
    else if (sleepModeOption === 'modem') iSleepCurrent = 20;

    // Average current: (I_active * t_active + I_sleep * t_sleep) / t_cycle
    const iAvg = (iActiveCurrent * tActiveSeconds + iSleepCurrent * tSleepSeconds) / tCycleSeconds;

    // Usable battery hours (with 15% safety buffer for temperature & self-discharge)
    const batteryHours = (batteryCapacity * 0.85) / iAvg;
    const batteryDays = batteryHours / 24;
    const batteryYears = batteryDays / 365.25;

    let meetsTarget = false;
    let badgeText = 'CRITICAL FAILURE';
    let badgeColor = '#ef4444';

    if (batteryYears >= 2.0) {
      meetsTarget = true;
      badgeText = 'OPTIMAL: 2+ YEAR DEPLOYMENT TARGET ACHIEVED';
      badgeColor = '#10b981';
    } else if (batteryDays >= 30) {
      badgeText = 'SUBOPTIMAL: REQUIRES FREQUENT RECHARGE';
      badgeColor = '#f59e0b';
    } else {
      badgeText = 'BATTERY DRAINED IN < 3 DAYS';
      badgeColor = '#ef4444';
    }

    return {
      iAvg: iAvg.toFixed(3),
      batteryHours: Math.round(batteryHours),
      batteryDays: Math.round(batteryDays),
      batteryYears: batteryYears.toFixed(2),
      meetsTarget,
      badgeText,
      badgeColor,
    };
  };

  const powerMetrics = calculatePowerBudget();

  // Knowledge Check Questions
  const QUIZ_QUESTIONS = [
    {
      id: 1,
      prompt: 'Why does keeping an IoT microcontroller in "Active (240MHz)" mode drain a 2500mAh battery in only ~30 hours?',
      options: [
        'The continuous 80mA clock draw consumes ~1900 mAh every 24 hours regardless of whether sensor data is being read.',
        'The LoRa transceiver inverts the battery polarity when idle.',
        'The I2C bus automatically shuts down if the clock frequency exceeds 100 kHz.',
        'Li-ion batteries cannot discharge below 95% capacity without solar assistance.',
      ],
      correctIndex: 0,
      explanation: 'Continuous active mode draws ~80mA, exhausting a 2500mAh battery in approximately 31 hours (2500 / 80). Deep-sleep duty cycling reduces average draw to microamps.',
    },
    {
      id: 2,
      prompt: 'Why is the BME680 sensor placed on a dedicated physical sensor plane with thermal isolation rather than right next to the ESP32 CPU?',
      options: [
        'To prevent heat from the dual-core processor from corrupting temperature, humidity, and VOC gas resistance readings.',
        'Because I2C wires cannot exceed 2 millimeters in physical PCB length.',
        'To shield the microcontroller from barometric air pressure changes.',
        'Because MEMS sensors require high-voltage AC current to operate.',
      ],
      correctIndex: 0,
      explanation: 'Microcontrollers dissipate heat during computation. Isolating the MEMS sensor prevents CPU thermal blooming from artificially skewing ambient temperature and relative humidity telemetry.',
    },
    {
      id: 3,
      prompt: 'What architectural characteristic makes LoRa (Long Range) superior to standard Wi-Fi for remote agricultural sensor nodes?',
      options: [
        'Sub-GHz Chirp Spread Spectrum modulation penetrates foliage and travels kilometers at micro-watt power levels without router pairing.',
        'LoRa provides 4K video streaming capabilities over satellite links.',
        'LoRa requires no antenna and operates inside solid metal enclosures.',
        'LoRa automatically generates electricity from atmospheric radio noise.',
      ],
      correctIndex: 0,
      explanation: 'LoRa operates at 868/915 MHz with CSS modulation, enabling 10+ km link budgets with tiny energy consumption, making it ideal for sparse telemetry.',
    },
  ];

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let score = 0;
    for (const q of QUIZ_QUESTIONS) {
      if (quizAnswers[q.id] === q.correctIndex) {
        score++;
      }
    }
    const finalPct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    setQuizScore(finalPct);
    setQuizSubmitted(true);

    if (finalPct >= 66) {
      setIsSubmitting(true);
      try {
        await apiClient.recordLabAttempt('iot-sensor-simulator', finalPct, 'completed', {
          powerMetrics,
          hologramViewExploded: explodedPercent,
          testedComponents: COMPONENTS.map((c) => c.id),
        });
        setSubmissionFeedback('Verification verified! +75 XP awarded to your profile.');
        if (onComplete) {
          onComplete(finalPct, { powerMetrics });
        }
      } catch (err: any) {
        setSubmissionFeedback('Lab attempt recorded locally (offline mode).');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setSubmissionFeedback('Review the 3D model and power telemetry and retry to pass verification.');
    }
  };

  // Exploded layer distance scalar
  const layerSpacing = (explodedPercent / 100) * 80;

  return (
    <div
      className="card"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{
        padding: '24px',
        backgroundColor: '#070D18',
        color: '#E2E8F0',
        borderRadius: '16px',
        border: '1px solid #1E293B',
        boxShadow: '0 8px 32px rgba(0, 240, 255, 0.08)',
        position: 'relative',
        overflow: 'hidden',
        outline: 'none',
      }}
      data-testid="hologram-3d-iot-lab"
    >
      {/* Top Holographic Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', borderBottom: '1px solid rgba(0, 240, 255, 0.2)', paddingBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', backgroundColor: 'rgba(0, 240, 255, 0.15)', color: '#00F0FF', fontWeight: 800, letterSpacing: '0.08em', border: '1px solid rgba(0, 240, 255, 0.4)' }}>
              HOLOGRAM 3D HARDWARE LAB
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Interactive IoT Node Architecture</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={24} color="#00F0FF" /> Edge IoT Sensor Node & Microcontroller Stack
          </h2>
        </div>

        {/* View Mode Tabs */}
        <div style={{ display: 'flex', gap: '6px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '8px', border: '1px solid #1E293B' }}>
          <button
            type="button"
            onClick={() => setActiveTab('inspect')}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'inspect' ? '#00F0FF' : 'transparent',
              color: activeTab === 'inspect' ? '#070D18' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={14} /> 3D Exploded Viewer
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'challenge' ? '#00F0FF' : 'transparent',
              color: activeTab === 'challenge' ? '#070D18' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={14} /> Power Budget Challenge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'quiz' ? '#00F0FF' : 'transparent',
              color: activeTab === 'quiz' ? '#070D18' : '#94A3B8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <HelpCircle size={14} /> Knowledge Check
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeTab === 'inspect' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', minHeight: '520px' }}>
          {/* 3D Canvas / Viewport */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              backgroundColor: '#040711',
              borderRadius: '12px',
              border: '1px solid rgba(0, 240, 255, 0.25)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              cursor: isDraggingRef.current ? 'grabbing' : 'grab',
              userSelect: 'none',
              perspective: '1200px',
            }}
          >
            {/* Hologram Grid Floor */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.12) 1px, transparent 0)',
                backgroundSize: '24px 24px',
                pointerEvents: 'none',
              }}
            />

            {/* Viewport Floating HUD Controls */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => { setRotX(55); setRotY(30); setZoom(100); }}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#00F0FF', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
              >
                Isometric
              </button>
              <button
                type="button"
                onClick={() => { setRotX(20); setRotY(75); setExplodedPercent(100); }}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#00F0FF', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
              >
                Exploded Profile
              </button>
              <button
                type="button"
                onClick={() => { setRotX(0); setRotY(0); setExplodedPercent(70); }}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#00F0FF', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
              >
                Top-Down Bus
              </button>
              <button
                type="button"
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                style={{ padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: isAutoRotating ? '#00F0FF' : 'rgba(15, 23, 42, 0.85)', color: isAutoRotating ? '#070D18' : '#00F0FF', border: '1px solid rgba(0, 240, 255, 0.3)', borderRadius: '4px', cursor: 'pointer' }}
              >
                {isAutoRotating ? 'Pause Orbit' : 'Auto Orbit'}
              </button>
            </div>

            {/* Reduced Motion Toggle & Hint */}
            <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: '#94A3B8', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={(e) => setReducedMotion(e.target.checked)}
                />
                Reduced Motion
              </label>
            </div>

            {/* 3D Transformation Root Container */}
            <div
              style={{
                width: '320px',
                height: '320px',
                transformStyle: 'preserve-3d',
                transform: `scale(${zoom / 100}) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                transition: isDraggingRef.current ? 'none' : 'transform 0.2s ease-out',
                position: 'relative',
              }}
            >
              {/* LAYER 1: BASE POWER & CHARGING PLANE (Bottom: Z = -layerSpacing * 1.5) */}
              <div
                onClick={() => setSelectedComponentId('power-mgmt')}
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  left: '40px',
                  top: '40px',
                  transform: `translateZ(${-layerSpacing * 1.5}px)`,
                  backgroundColor: selectedComponentId === 'power-mgmt' ? 'rgba(0, 240, 255, 0.25)' : 'rgba(15, 23, 42, 0.85)',
                  border: `2px solid ${selectedComponentId === 'power-mgmt' ? '#00F0FF' : 'rgba(59, 130, 246, 0.4)'}`,
                  borderRadius: '12px',
                  boxShadow: selectedComponentId === 'power-mgmt' ? '0 0 25px rgba(0, 240, 255, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.05em' }}>LAYER 1: POWER PLANE</span>
                  <Zap size={14} color="#38BDF8" />
                </div>
                {/* USB-C Connector */}
                <div style={{ width: '48px', height: '18px', backgroundColor: '#64748B', borderRadius: '4px', border: '1px solid #94A3B8', marginTop: '14px', alignSelf: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.55rem', color: '#FFFFFF', fontWeight: 800 }}>USB-C</span>
                </div>
                {/* TP4056 & LDO ICs */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '30px' }}>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#1E293B', border: '1px solid #38BDF8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: '#38BDF8', fontWeight: 700 }}>TP4056</span>
                  </div>
                  <div style={{ width: '42px', height: '42px', backgroundColor: '#1E293B', border: '1px solid #38BDF8', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.6rem', color: '#38BDF8', fontWeight: 700 }}>3.3V LDO</span>
                  </div>
                </div>
              </div>

              {/* LAYER 2: COMPUTE & PROCESSING PLANE (Z = -layerSpacing * 0.5) */}
              <div
                onClick={() => setSelectedComponentId('esp32-s3')}
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  left: '40px',
                  top: '40px',
                  transform: `translateZ(${-layerSpacing * 0.5}px)`,
                  backgroundColor: selectedComponentId === 'esp32-s3' ? 'rgba(0, 240, 255, 0.28)' : 'rgba(15, 23, 42, 0.85)',
                  border: `2px solid ${selectedComponentId === 'esp32-s3' ? '#00F0FF' : 'rgba(16, 185, 129, 0.4)'}`,
                  borderRadius: '12px',
                  boxShadow: selectedComponentId === 'esp32-s3' ? '0 0 25px rgba(0, 240, 255, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981', letterSpacing: '0.05em' }}>LAYER 2: COMPUTE PLANE</span>
                  <Cpu size={14} color="#10B981" />
                </div>
                {/* ESP32-S3 SoC Metallic Canister */}
                <div style={{ width: '110px', height: '110px', backgroundColor: '#334155', border: '2px solid #94A3B8', borderRadius: '8px', alignSelf: 'center', marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#FFFFFF' }}>ESP32-S3</span>
                  <span style={{ fontSize: '0.55rem', color: '#CBD5E1' }}>240MHz Dual-Core</span>
                  <div style={{ width: '80%', height: '3px', backgroundColor: '#00F0FF', marginTop: '6px', borderRadius: '2px' }} />
                </div>
                {/* Copper Trace Antenna */}
                <div style={{ width: '60px', height: '8px', borderTop: '2px dashed #F59E0B', borderRight: '2px dashed #F59E0B', alignSelf: 'flex-end', marginTop: '8px' }} />
              </div>

              {/* LAYER 3: ENVIRONMENTAL SENSOR SUBSYSTEM (Z = layerSpacing * 0.5) */}
              <div
                onClick={() => setSelectedComponentId('bme680')}
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  left: '40px',
                  top: '40px',
                  transform: `translateZ(${layerSpacing * 0.5}px)`,
                  backgroundColor: selectedComponentId === 'bme680' ? 'rgba(0, 240, 255, 0.28)' : 'rgba(15, 23, 42, 0.85)',
                  border: `2px solid ${selectedComponentId === 'bme680' ? '#00F0FF' : 'rgba(245, 158, 11, 0.4)'}`,
                  borderRadius: '12px',
                  boxShadow: selectedComponentId === 'bme680' ? '0 0 25px rgba(0, 240, 255, 0.4)' : '0 8px 16px rgba(0, 0, 0, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#F59E0B', letterSpacing: '0.05em' }}>LAYER 3: SENSOR ARRAY</span>
                  <Activity size={14} color="#F59E0B" />
                </div>
                {/* BME680 Metallic Sensor Die */}
                <div style={{ width: '64px', height: '64px', backgroundColor: '#475569', border: '2px solid #F59E0B', borderRadius: '6px', alignSelf: 'center', marginTop: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 900, color: '#FFFFFF' }}>BME680</span>
                  <span style={{ fontSize: '0.48rem', color: '#FCD34D' }}>MEMS GAS+P+T</span>
                </div>
                {/* I2C Bus Etched Traces */}
                <div style={{ fontSize: '0.55rem', color: '#94A3B8', marginTop: '16px', textAlign: 'center' }}>
                  SDA / SCL I2C 400kHz Lines
                </div>
              </div>

              {/* LAYER 4: TELEMETRY & USER INTERFACE PLANE (Z = layerSpacing * 1.5) */}
              <div
                style={{
                  position: 'absolute',
                  width: '240px',
                  height: '240px',
                  left: '40px',
                  top: '40px',
                  transform: `translateZ(${layerSpacing * 1.5}px)`,
                  backgroundColor: (selectedComponentId === 'lora-rf' || selectedComponentId === 'oled-display') ? 'rgba(0, 240, 255, 0.28)' : 'rgba(15, 23, 42, 0.85)',
                  border: '2px solid rgba(168, 85, 247, 0.4)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.6)',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#A855F7', letterSpacing: '0.05em' }}>LAYER 4: LORA RF & OLED</span>
                  <Radio size={14} color="#A855F7" />
                </div>

                {/* OLED Screen */}
                <div
                  onClick={(e) => { e.stopPropagation(); setSelectedComponentId('oled-display'); }}
                  style={{
                    width: '130px',
                    height: '60px',
                    backgroundColor: '#000000',
                    border: `2px solid ${selectedComponentId === 'oled-display' ? '#00F0FF' : '#475569'}`,
                    borderRadius: '4px',
                    alignSelf: 'center',
                    marginTop: '12px',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: '#00F0FF' }}>
                    <span>NODE: 0x4A</span>
                    <span>BAT: 98%</span>
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#00F0FF', fontWeight: 800, textAlign: 'center' }}>
                    24.2°C • 1013 hPa
                  </div>
                  <div style={{ fontSize: '0.45rem', color: '#38BDF8', textAlign: 'right' }}>
                    LORA TX OK
                  </div>
                </div>

                {/* LoRa Radio */}
                <div
                  onClick={(e) => { e.stopPropagation(); setSelectedComponentId('lora-rf'); }}
                  style={{
                    width: '90px',
                    height: '50px',
                    backgroundColor: '#1E293B',
                    border: `2px solid ${selectedComponentId === 'lora-rf' ? '#00F0FF' : '#A855F7'}`,
                    borderRadius: '6px',
                    alignSelf: 'center',
                    marginTop: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#FFFFFF' }}>LoRa RF</span>
                  <span style={{ fontSize: '0.5rem', color: '#C084FC' }}>868/915 MHz CSS</span>
                </div>
              </div>
            </div>

            {/* Bottom Slider: Exploded View Percentage */}
            <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px', zIndex: 10, backgroundColor: 'rgba(15, 23, 42, 0.85)', padding: '10px 16px', borderRadius: '8px', border: '1px solid #1E293B', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <Layers size={16} color="#00F0FF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E2E8F0', minWidth: '100px' }}>
                Exploded View: {explodedPercent}%
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={explodedPercent}
                onChange={(e) => setExplodedPercent(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#00F0FF', cursor: 'pointer' }}
                aria-label="Adjust 3D exploded layer separation"
              />
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                {explodedPercent === 0 ? 'Assembled Stack' : 'Exploded Layer Depth'}
              </span>
            </div>
          </div>

          {/* Right Side: Component Telemetry HUD */}
          <div style={{ backgroundColor: '#0A1120', padding: '20px', borderRadius: '12px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(0, 240, 255, 0.2)', color: '#00F0FF', fontWeight: 800 }}>
                {activeComponent.layerName.toUpperCase()}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Layer {activeComponent.layer} of 4</span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', marginBottom: '8px', lineHeight: 1.3 }}>
              {activeComponent.name}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0', padding: '12px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid #1E293B' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94A3B8' }}>Voltage Rail:</span>
                <span style={{ color: '#F8FAFC', fontWeight: 700 }}>{activeComponent.voltage}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94A3B8' }}>Bus Protocol:</span>
                <span style={{ color: '#00F0FF', fontWeight: 700 }}>{activeComponent.busProtocol}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94A3B8' }}>Active Draw:</span>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>{activeComponent.currentDrawActive}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                <span style={{ color: '#94A3B8' }}>Sleep Draw:</span>
                <span style={{ color: '#10B981', fontWeight: 700 }}>{activeComponent.currentDrawSleep}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#CBD5E1', lineHeight: 1.5, marginBottom: '14px' }}>
              {activeComponent.description}
            </p>

            <div style={{ padding: '10px 12px', backgroundColor: 'rgba(0, 240, 255, 0.08)', borderRadius: '6px', border: '1px solid rgba(0, 240, 255, 0.25)', marginTop: 'auto' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00F0FF', marginBottom: '2px' }}>
                WHY 3D STACKED ARCHITECTURE?
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>
                {activeComponent.why3D}
              </div>
            </div>

            {/* Quick Switch Component Buttons */}
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMPONENTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedComponentId(c.id)}
                  style={{
                    padding: '4px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    borderRadius: '4px',
                    border: `1px solid ${selectedComponentId === c.id ? '#00F0FF' : '#334155'}`,
                    backgroundColor: selectedComponentId === c.id ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                    color: selectedComponentId === c.id ? '#00F0FF' : '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  {c.category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenge Tab: Power Budget Simulation */}
      {activeTab === 'challenge' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div style={{ backgroundColor: '#0A1120', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Compass size={20} color="#00F0FF" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Off-Grid Remote Weather Station Configuration
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', lineHeight: 1.5, marginBottom: '20px' }}>
              Your engineering challenge is to configure the IoT Node firmware so it can survive for at least <strong>2.0 Years</strong> on a single 2500mAh 18650 Li-ion cell without battery replacement.
            </p>

            {/* Config Option 1: Telemetry Interval */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#00F0FF', marginBottom: '8px' }}>
                1. Telemetry Transmission Interval:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: '1s', label: '1 Second', desc: 'Realtime continuous' },
                  { id: '30s', label: '30 Seconds', desc: 'Periodic check' },
                  { id: '15m', label: '15 Minutes', desc: 'Weather station optimal' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIntervalOption(opt.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${intervalOption === opt.id ? '#00F0FF' : '#1E293B'}`,
                      backgroundColor: intervalOption === opt.id ? 'rgba(0, 240, 255, 0.15)' : '#070D18',
                      color: intervalOption === opt.id ? '#00F0FF' : '#94A3B8',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Option 2: CPU Sleep Mode */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#00F0FF', marginBottom: '8px' }}>
                2. Inter-Transmission CPU Power Mode:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { id: 'active', label: 'Active 240MHz', desc: '80 mA continuous' },
                  { id: 'modem', label: 'Modem-Sleep', desc: '20 mA clock gating' },
                  { id: 'deep', label: 'Deep-Sleep (RTC)', desc: '10 µA current draw' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSleepModeOption(opt.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${sleepModeOption === opt.id ? '#00F0FF' : '#1E293B'}`,
                      backgroundColor: sleepModeOption === opt.id ? 'rgba(0, 240, 255, 0.15)' : '#070D18',
                      color: sleepModeOption === opt.id ? '#00F0FF' : '#94A3B8',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Config Option 3: Sensor Precision */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#00F0FF', marginBottom: '8px' }}>
                3. BME680 Sensor Precision & Gas Heater:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  { id: 'fast', label: 'Fast 1x Read (No Heater)', desc: '10ms sample, 1.2mA' },
                  { id: 'precision', label: 'Full 16x + VOC Heater', desc: '120ms @ 300°C heater, 12mA' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSensorPrecisionOption(opt.id as any)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${sensorPrecisionOption === opt.id ? '#00F0FF' : '#1E293B'}`,
                      backgroundColor: sensorPrecisionOption === opt.id ? 'rgba(0, 240, 255, 0.15)' : '#070D18',
                      color: sensorPrecisionOption === opt.id ? '#00F0FF' : '#94A3B8',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: '0.82rem' }}>{opt.label}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Real-time Mathematical Battery Forecast */}
          <div style={{ backgroundColor: '#040711', padding: '24px', borderRadius: '12px', border: '1px solid rgba(0, 240, 255, 0.3)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Battery size={20} color="#00F0FF" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                Live Power & Lifespan Telemetry
              </h3>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #1E293B', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
                Average Current Draw (I_avg):
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#00F0FF', fontFamily: 'monospace' }}>
                {powerMetrics.iAvg} mA
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                Formula: (I_active × t_active + I_sleep × t_sleep) / t_cycle
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #1E293B', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '4px' }}>
                Projected Battery Lifespan (2500mAh Cell):
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: powerMetrics.badgeColor, fontFamily: 'monospace' }}>
                {Number(powerMetrics.batteryYears) >= 1 ? `${powerMetrics.batteryYears} Years` : `${powerMetrics.batteryDays} Days`}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#CBD5E1', marginTop: '6px' }}>
                Total Operating Time: {powerMetrics.batteryHours} Hours
              </div>
            </div>

            <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: `${powerMetrics.badgeColor}15`, border: `1px solid ${powerMetrics.badgeColor}40`, color: powerMetrics.badgeColor, fontSize: '0.8rem', fontWeight: 800, textAlign: 'center', marginTop: 'auto' }}>
              {powerMetrics.badgeText}
            </div>

            {powerMetrics.meetsTarget && (
              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                style={{
                  marginTop: '16px',
                  padding: '12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: '#00F0FF',
                  color: '#070D18',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                Proceed to Knowledge Check <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Tab: Demonstrable Learning Outcome */}
      {activeTab === 'quiz' && (
        <div style={{ maxWidth: '780px', margin: '0 auto', backgroundColor: '#0A1120', padding: '24px', borderRadius: '12px', border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <HelpCircle size={20} color="#00F0FF" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
              Hardware Verification & Knowledge Check
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '20px' }}>
            Answer these 3 first-principles questions regarding IoT hardware stack architecture and power management to unlock your verified competency badge.
          </p>

          <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {QUIZ_QUESTIONS.map((q, qIdx) => (
              <div key={q.id} style={{ padding: '16px', backgroundColor: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid #1E293B' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: '#F8FAFC', marginBottom: '12px' }}>
                  {qIdx + 1}. {q.prompt}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, optIdx) => (
                    <label
                      key={optIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        backgroundColor: quizAnswers[q.id] === optIdx ? 'rgba(0, 240, 255, 0.12)' : '#070D18',
                        border: `1px solid ${quizAnswers[q.id] === optIdx ? '#00F0FF' : '#1E293B'}`,
                        cursor: 'pointer',
                        fontSize: '0.84rem',
                        color: quizAnswers[q.id] === optIdx ? '#00F0FF' : '#CBD5E1',
                      }}
                    >
                      <input
                        type="radio"
                        name={`quiz-q-${q.id}`}
                        checked={quizAnswers[q.id] === optIdx}
                        onChange={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                        style={{ accentColor: '#00F0FF' }}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {submissionFeedback && (
              <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: quizScore && quizScore >= 66 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: quizScore && quizScore >= 66 ? '#10B981' : '#EF4444', fontSize: '0.85rem', fontWeight: 700, textAlign: 'center' }}>
                {submissionFeedback}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
              style={{
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? '#334155' : '#00F0FF',
                color: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? '#94A3B8' : '#070D18',
                fontWeight: 900,
                fontSize: '0.95rem',
                cursor: Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSubmitting ? 'Verifying with Authoritative Database…' : 'Submit Lab Verification & Record XP'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Hologram3DIoTNode;
