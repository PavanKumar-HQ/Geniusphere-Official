
import React from 'react';
import { BookOpen, Palette, Users, Globe, User, Shield, Info, BarChart } from 'lucide-react';

export const COLORS = {
  professional: '#4DA3FF',
  skills: '#2AFFA2',
  creativity: '#8B7CFF',
  risky: '#FF4D4D',
  neutral: '#E6E9F0',
  bgDark: '#0B1220',
  bgPanel: '#111827'
};

export const PROFILE_ELEMENTS = [
  { icon: <User size={18} />, label: 'Profile Photo' },
  { icon: <Info size={18} />, label: 'Bio / About' },
  { icon: <Palette size={18} />, label: 'Interests & Skills' },
  { icon: <Globe size={18} />, label: 'Posts & Content' },
  { icon: <Users size={18} />, label: 'Activity & Comments' },
  { icon: <Shield size={18} />, label: 'Privacy Settings' },
  { icon: <BarChart size={18} />, label: 'Digital Footprint' },
  { icon: <BookOpen size={18} />, label: 'Platform Purpose' },
];

export const SKILL_OPTIONS = [
  'Coding', 'Sports', 'Digital Art', 'Writing', 'Music', 'Leadership', 'Mathematics', 'Environment'
];

export const MYTHS_VS_REALITY = [
  { myth: "More followers = success", reality: "Skills and character matter more" },
  { myth: "Viral content is always good", reality: "Responsible content builds reputation" },
  { myth: "Online life is separate", reality: "Online actions affect real life" }
];
