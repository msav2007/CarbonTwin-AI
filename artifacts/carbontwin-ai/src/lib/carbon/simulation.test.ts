import { describe, it, expect } from 'vitest';
import { buildFutureSimulations } from '@/lib/carbon/simulation';
import { buildRecommendedActions } from '@/lib/carbon/assistant';
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

describe('buildFutureSimulations', () => {
  const annualKg = 12000;
  const reductionPotentialKg = 2500;
  const topCategory = 'transport';
  const actions = buildRecommendedActions(highImpactProfile, topCategory);

  it('returns both steady and ambitious simulations', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    expect(sims.steady).toBeDefined();
    expect(sims.ambitious).toBeDefined();
  });

  it('each simulation has 3 outlook horizons (1, 5, 10 years)', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    expect(sims.steady.outlook).toHaveLength(3);
    expect(sims.ambitious.outlook).toHaveLength(3);
    expect(sims.steady.outlook[0].years).toBe(1);
    expect(sims.steady.outlook[1].years).toBe(5);
    expect(sims.steady.outlook[2].years).toBe(10);
  });

  it('each year result has required numeric fields', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    const yearResult = sims.steady.outlook[0];
    expect(typeof yearResult.baselineAnnualKg).toBe('number');
    expect(typeof yearResult.plannedAnnualKg).toBe('number');
    expect(typeof yearResult.annualReductionKg).toBe('number');
    expect(typeof yearResult.totalAvoidedKg).toBe('number');
    expect(typeof yearResult.scoreIfMaintained).toBe('number');
    expect(typeof yearResult.narrative).toBe('string');
  });

  it('ambitious mode achieves greater reduction than steady', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    const steadyAt10 = sims.steady.outlook[2].plannedAnnualKg;
    const ambitiousAt10 = sims.ambitious.outlook[2].plannedAnnualKg;
    expect(ambitiousAt10).toBeLessThanOrEqual(steadyAt10);
  });

  it('planned kg is always non-negative', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    for (const mode of ['steady', 'ambitious'] as const) {
      for (const year of sims[mode].outlook) {
        expect(year.plannedAnnualKg).toBeGreaterThanOrEqual(0);
        expect(year.annualReductionKg).toBeGreaterThanOrEqual(0);
        expect(year.totalAvoidedKg).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it('score is clamped between 0 and 100', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    for (const mode of ['steady', 'ambitious'] as const) {
      for (const year of sims[mode].outlook) {
        expect(year.scoreIfMaintained).toBeGreaterThanOrEqual(0);
        expect(year.scoreIfMaintained).toBeLessThanOrEqual(100);
      }
    }
  });

  it('summaries are non-empty strings', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    expect(sims.steady.summary.length).toBeGreaterThan(0);
    expect(sims.ambitious.summary.length).toBeGreaterThan(0);
  });

  it('works for low-impact profiles', () => {
    const lowActions = buildRecommendedActions(lowImpactProfile, 'food');
    const sims = buildFutureSimulations(
      lowImpactProfile,
      2000,
      500,
      'food',
      lowActions
    );
    expect(sims.steady.outlook).toHaveLength(3);
    expect(sims.ambitious.outlook).toHaveLength(3);
  });

  it('narrative strings mention the number of years', () => {
    const sims = buildFutureSimulations(
      highImpactProfile,
      annualKg,
      reductionPotentialKg,
      topCategory,
      actions
    );
    expect(sims.steady.outlook[0].narrative).toContain('1 year');
    expect(sims.steady.outlook[1].narrative).toContain('5 years');
    expect(sims.steady.outlook[2].narrative).toContain('10 years');
  });
});
