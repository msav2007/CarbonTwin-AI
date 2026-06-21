import { describe, it, expect } from 'vitest';
import {
  calculateCarbonResult,
  calculatePartialCarbonEstimate,
  isOnboardingComplete,
} from '@/lib/carbon/calculator';
import { formatTonnes, calculateCarbonScore } from '@/lib/carbon/math';
import { AVERAGE_ANNUAL_KG, DAILY_BUDGET_KG } from '@/lib/carbon/constants';
import type { OnboardingData } from '@/types';

const highImpactProfile: OnboardingData = {
  name: 'TestUser',
  transport: 'car',
  diet: 'meat-heavy',
  homeEnergy: 'high',
  household: 'solo',
  travel: 'frequent',
  shopping: 'frequent',
  motivation: 'shrink-footprint',
};

const lowImpactProfile: OnboardingData = {
  name: 'EcoUser',
  transport: 'bike',
  diet: 'vegan',
  homeEnergy: 'low',
  household: 'family',
  travel: 'rare',
  shopping: 'minimal',
  motivation: 'consume-less',
};

describe('formatTonnes', () => {
  it('formats 1500 kg as "1.5"', () => {
    expect(formatTonnes(1500)).toBe('1.5');
  });

  it('rounds 1560 kg to "1.6"', () => {
    expect(formatTonnes(1560)).toBe('1.6');
  });

  it('formats 20000 kg as "20.0"', () => {
    expect(formatTonnes(20000)).toBe('20.0');
  });
});

describe('calculateCarbonResult', () => {
  it('calculates full carbon result for high-impact profile', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.annualKg).toBeGreaterThan(10000);
    expect(result.carbonScore).toBeLessThan(50);
  });

  it('includes consistent time-period calculations', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.monthlyKg).toBe(Math.round(result.annualKg / 12));
    expect(result.dailyKg).toBe(Math.round((result.annualKg / 365) * 10) / 10);
  });

  it('daily budget equals expected constant', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.dailyBudgetKg).toBe(DAILY_BUDGET_KG);
  });

  it('breakdown percentages sum to approximately 100', () => {
    const result = calculateCarbonResult(highImpactProfile);
    const total =
      result.breakdownPct.transport +
      result.breakdownPct.food +
      result.breakdownPct.home +
      result.breakdownPct.travel +
      result.breakdownPct.shopping;
    expect(total).toBeGreaterThanOrEqual(95);
    expect(total).toBeLessThanOrEqual(105);
  });

  it('breakdown values are all positive', () => {
    const result = calculateCarbonResult(highImpactProfile);
    for (const [, val] of Object.entries(result.breakdown)) {
      expect(val).toBeGreaterThan(0);
    }
  });

  it('generates a valid twin profile', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(typeof result.twin.name).toBe('string');
    expect(result.twin.ownerName).toBe('TestUser');
    expect(result.twin.dominantCategory).toBeDefined();
    expect(result.twin.traits.length).toBeGreaterThan(0);
  });

  it('generates simulations with 3 horizons each', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.simulations.steady).toBeDefined();
    expect(result.simulations.ambitious).toBeDefined();
    expect(result.simulations.steady.outlook).toHaveLength(3);
    expect(result.simulations.ambitious.outlook).toHaveLength(3);
  });

  it('provides at least one recommended action', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.recommendedActions.length).toBeGreaterThan(0);
  });

  it('target score is at least as high as current score for high-impact profile', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.targetScore).toBeGreaterThanOrEqual(result.carbonScore);
  });

  it('target score is higher for a moderately high profile', () => {
    const moderateProfile: OnboardingData = {
      name: 'Moderate',
      transport: 'car',
      diet: 'balanced',
      homeEnergy: 'medium',
      household: 'solo',
      travel: 'occasional',
      shopping: 'moderate',
      motivation: 'shrink-footprint',
    };
    const result = calculateCarbonResult(moderateProfile);
    expect(result.targetScore).toBeGreaterThan(result.carbonScore);
  });

  it('target annual kg is less than current annual kg', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.targetAnnualKg).toBeLessThan(result.annualKg);
  });

  it('reduction potential equals sum of action savings', () => {
    const result = calculateCarbonResult(highImpactProfile);
    const expectedReduction = result.recommendedActions.reduce(
      (sum, a) => sum + a.annualSavingsKg,
      0
    );
    expect(result.reductionPotentialKg).toBe(expectedReduction);
  });

  it('vsAveragePct is positive for above-average profile', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.vsAveragePct).toBeGreaterThan(0);
  });

  it('vsAveragePct is negative for below-average profile', () => {
    const result = calculateCarbonResult(lowImpactProfile);
    expect(result.vsAveragePct).toBeLessThan(0);
  });

  it('low-impact profile emits less than high-impact profile', () => {
    const highResult = calculateCarbonResult(highImpactProfile);
    const lowResult = calculateCarbonResult(lowImpactProfile);
    expect(lowResult.annualKg).toBeLessThan(highResult.annualKg);
    expect(lowResult.carbonScore).toBeGreaterThan(highResult.carbonScore);
  });

  it('profile and coach are populated', () => {
    const result = calculateCarbonResult(highImpactProfile);
    expect(result.profile).not.toBeNull();
    expect(result.coach.length).toBeGreaterThan(0);
  });

  it('household multiplier reduces home energy for family vs solo', () => {
    const soloResult = calculateCarbonResult({ ...highImpactProfile, household: 'solo' });
    const familyResult = calculateCarbonResult({ ...highImpactProfile, household: 'family' });
    expect(familyResult.breakdown.home).toBeLessThan(soloResult.breakdown.home);
  });

  it('handles all transport types without error', () => {
    const transports: OnboardingData['transport'][] = ['car', 'mixed', 'transit', 'bike', 'walk'];
    for (const transport of transports) {
      expect(() => calculateCarbonResult({ ...highImpactProfile, transport })).not.toThrow();
    }
  });

  it('handles all diet types without error', () => {
    const diets: OnboardingData['diet'][] = ['meat-heavy', 'balanced', 'vegetarian', 'vegan'];
    for (const diet of diets) {
      expect(() => calculateCarbonResult({ ...highImpactProfile, diet })).not.toThrow();
    }
  });

  it('handles all motivation types without error', () => {
    const motivations: OnboardingData['motivation'][] = [
      'shrink-footprint', 'lower-bills', 'travel-smarter', 'consume-less',
    ];
    for (const motivation of motivations) {
      expect(() => calculateCarbonResult({ ...highImpactProfile, motivation })).not.toThrow();
    }
  });
});

describe('calculatePartialCarbonEstimate', () => {
  it('returns a valid estimate for empty input', () => {
    const estimate = calculatePartialCarbonEstimate({});
    expect(estimate.annualKg).toBeGreaterThan(0);
    expect(estimate.carbonScore).toBeGreaterThanOrEqual(0);
    expect(estimate.confidence).toBe(0);
    expect(estimate.completedSignals).toBe(0);
  });

  it('confidence increases as more fields are filled', () => {
    const partial1 = calculatePartialCarbonEstimate({ transport: 'car' });
    const partial2 = calculatePartialCarbonEstimate({ transport: 'car', diet: 'balanced' });
    expect(partial2.confidence).toBeGreaterThan(partial1.confidence);
  });

  it('returns 100% confidence for fully complete data', () => {
    const complete = calculatePartialCarbonEstimate(highImpactProfile);
    expect(complete.confidence).toBe(100);
    expect(complete.completedSignals).toBe(complete.totalSignals);
  });

  it('monthly and daily kg are derived from annual', () => {
    const estimate = calculatePartialCarbonEstimate(highImpactProfile);
    expect(estimate.monthlyKg).toBe(Math.round(estimate.annualKg / 12));
    expect(estimate.dailyKg).toBe(Math.round((estimate.annualKg / 365) * 10) / 10);
  });

  it('selected map correctly marks provided fields as true', () => {
    const estimate = calculatePartialCarbonEstimate({ transport: 'car', diet: 'vegan' });
    expect(estimate.selected.transport).toBe(true);
    expect(estimate.selected.food).toBe(true);
    expect(estimate.selected.home).toBe(false);
    expect(estimate.selected.travel).toBe(false);
    expect(estimate.selected.shopping).toBe(false);
  });

  it('carbon score is clamped between 0 and 100', () => {
    const estimate = calculatePartialCarbonEstimate(highImpactProfile);
    expect(estimate.carbonScore).toBeGreaterThanOrEqual(0);
    expect(estimate.carbonScore).toBeLessThanOrEqual(100);
  });

  it('uses transport constant correctly when transport provided', () => {
    const estimate = calculatePartialCarbonEstimate({ transport: 'car' });
    expect(estimate.breakdown.transport).toBe(3200);
  });

  it('home kg uses solo multiplier (1.0) for solo + high', () => {
    const estimate = calculatePartialCarbonEstimate({
      homeEnergy: 'high',
      household: 'solo',
    });
    expect(estimate.breakdown.home).toBe(2800);
  });
});

describe('isOnboardingComplete', () => {
  it('returns true for fully complete data', () => {
    expect(isOnboardingComplete(highImpactProfile)).toBe(true);
  });

  it('returns false when name is missing', () => {
    const { name: _name, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when name is empty string', () => {
    expect(isOnboardingComplete({ ...highImpactProfile, name: '' })).toBe(false);
  });

  it('returns false when name is only whitespace', () => {
    expect(isOnboardingComplete({ ...highImpactProfile, name: '   ' })).toBe(false);
  });

  it('returns false when transport is missing', () => {
    const { transport: _transport, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when diet is missing', () => {
    const { diet: _diet, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when homeEnergy is missing', () => {
    const { homeEnergy: _homeEnergy, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when household is missing', () => {
    const { household: _household, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when travel is missing', () => {
    const { travel: _travel, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when shopping is missing', () => {
    const { shopping: _shopping, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false when motivation is missing', () => {
    const { motivation: _motivation, ...rest } = highImpactProfile;
    expect(isOnboardingComplete(rest)).toBe(false);
  });

  it('returns false for empty object', () => {
    expect(isOnboardingComplete({})).toBe(false);
  });

  it('low-impact profile is also complete', () => {
    expect(isOnboardingComplete(lowImpactProfile)).toBe(true);
  });
});

describe('calculateCarbonScore (integration)', () => {
  it('higher annualKg results in lower score', () => {
    const score1 = calculateCarbonScore(2000);
    const score2 = calculateCarbonScore(8000);
    expect(score1).toBeGreaterThan(score2);
  });

  it('average emissions yield a mid-range score', () => {
    const score = calculateCarbonScore(AVERAGE_ANNUAL_KG);
    expect(score).toBeGreaterThan(20);
    expect(score).toBeLessThan(80);
  });
});
