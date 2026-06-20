import { describe, it, expect } from 'vitest';
import { calculateCarbonResult, formatTonnes } from '@/lib/carbon/calculator';
import type { OnboardingData } from '@/types';

describe('Carbon Calculator', () => {
  const sampleProfile: OnboardingData = {
    name: 'TestUser',
    transport: 'car',
    diet: 'meat-heavy',
    homeEnergy: 'high',
    household: 'solo',
    travel: 'frequent',
    shopping: 'frequent',
    motivation: 'shrink-footprint'
  };

  it('should format tonnes correctly', () => {
    expect(formatTonnes(1500)).toBe('1.5');
    expect(formatTonnes(1560)).toBe('1.6');
    expect(formatTonnes(20000)).toBe('20.0');
  });

  it('should calculate full carbon result', () => {
    const result = calculateCarbonResult(sampleProfile);
    
    expect(result.annualKg).toBeGreaterThan(10000); // High impact profile
    expect(result.carbonScore).toBeLessThan(500); // Bad score for high impact
    
    // Check breakdowns
    expect(result.breakdownPct.transport).toBeGreaterThan(0);
    expect(result.breakdownPct.food).toBeGreaterThan(0);
    
    // Check twin generation
    expect(typeof result.twin.name).toBe('string');
    expect(result.twin.ownerName).toBe('TestUser');
    expect(result.twin.dominantCategory).toBeDefined();
    
    // Check simulations exist
    expect(result.simulations.steady).toBeDefined();
    expect(result.simulations.ambitious).toBeDefined();
    
    // Check recommendations
    expect(result.recommendedActions.length).toBeGreaterThan(0);
  });

  it('should reflect lower emissions for low-impact profile', () => {
    const lowImpactProfile: OnboardingData = {
      name: 'EcoUser',
      transport: 'bike',
      diet: 'vegan',
      homeEnergy: 'low',
      household: 'family',
      travel: 'rare',
      shopping: 'minimal',
      motivation: 'shrink-footprint'
    };

    const highImpactResult = calculateCarbonResult(sampleProfile);
    const lowImpactResult = calculateCarbonResult(lowImpactProfile);

    expect(lowImpactResult.annualKg).toBeLessThan(highImpactResult.annualKg);
    expect(lowImpactResult.carbonScore).toBeGreaterThan(highImpactResult.carbonScore);
    expect(lowImpactResult.dailyBudgetKg).toBeGreaterThan(0);
  });
});
