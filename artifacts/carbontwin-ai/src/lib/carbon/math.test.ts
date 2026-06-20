import { describe, it, expect } from 'vitest';
import { clamp, sumBreakdown, calculateCarbonScore, formatTonnes } from '@/lib/carbon/math';
import type { CategoryBreakdown } from '@/lib/carbon/types';

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('clamps to min when below range', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
    expect(clamp(-100, 0, 10)).toBe(0);
  });

  it('clamps to max when above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(1000, 0, 100)).toBe(100);
  });

  it('works with decimal values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(-0.1, 0, 1)).toBe(0);
    expect(clamp(1.1, 0, 1)).toBe(1);
  });

  it('works when min equals max', () => {
    expect(clamp(5, 3, 3)).toBe(3);
    expect(clamp(0, 3, 3)).toBe(3);
  });
});

describe('sumBreakdown', () => {
  it('sums all category values', () => {
    const breakdown: CategoryBreakdown = {
      transport: 1000,
      food: 800,
      home: 600,
      travel: 400,
      shopping: 200,
    };
    expect(sumBreakdown(breakdown)).toBe(3000);
  });

  it('handles zero values', () => {
    const breakdown: CategoryBreakdown = {
      transport: 0,
      food: 0,
      home: 0,
      travel: 0,
      shopping: 0,
    };
    expect(sumBreakdown(breakdown)).toBe(0);
  });

  it('handles typical high-impact profile', () => {
    const breakdown: CategoryBreakdown = {
      transport: 3200,
      food: 2800,
      home: 2800,
      travel: 3500,
      shopping: 2200,
    };
    expect(sumBreakdown(breakdown)).toBe(14500);
  });

  it('handles typical low-impact profile', () => {
    const breakdown: CategoryBreakdown = {
      transport: 80,
      food: 800,
      home: 348,
      travel: 300,
      shopping: 400,
    };
    expect(sumBreakdown(breakdown)).toBe(1928);
  });
});

describe('calculateCarbonScore', () => {
  it('returns 100 for zero emissions', () => {
    expect(calculateCarbonScore(0)).toBe(100);
  });

  it('scores average emissions (4200 kg) correctly', () => {
    const score = calculateCarbonScore(4200);
    expect(score).toBe(58);
  });

  it('returns lower score for higher emissions', () => {
    const lowScore = calculateCarbonScore(10000);
    const highScore = calculateCarbonScore(3000);
    expect(lowScore).toBeLessThan(highScore);
  });

  it('clamps to 0 for very high emissions', () => {
    expect(calculateCarbonScore(15000)).toBe(0);
    expect(calculateCarbonScore(20000)).toBe(0);
  });

  it('clamps to 100 for zero or negative emissions', () => {
    expect(calculateCarbonScore(0)).toBe(100);
  });

  it('returns integer values', () => {
    const score = calculateCarbonScore(3750);
    expect(Number.isInteger(score)).toBe(true);
  });
});

describe('formatTonnes', () => {
  it('formats kg to tonnes with one decimal place', () => {
    expect(formatTonnes(1000)).toBe('1.0');
    expect(formatTonnes(1500)).toBe('1.5');
    expect(formatTonnes(4200)).toBe('4.2');
  });

  it('rounds to one decimal place', () => {
    expect(formatTonnes(1560)).toBe('1.6');
    expect(formatTonnes(1540)).toBe('1.5');
    expect(formatTonnes(1550)).toBe('1.6');
  });

  it('handles zero', () => {
    expect(formatTonnes(0)).toBe('0.0');
  });

  it('handles large values', () => {
    expect(formatTonnes(20000)).toBe('20.0');
    expect(formatTonnes(14500)).toBe('14.5');
  });

  it('returns string type', () => {
    expect(typeof formatTonnes(1000)).toBe('string');
  });
});
