import { describe, it, expect } from 'vitest';
import {
  buildRecommendedActions,
  buildTwinProfile,
  buildCarbonProfile,
  buildCoachingInsights,
} from '@/lib/carbon/assistant';
import { DAILY_BUDGET_KG } from '@/lib/carbon/constants';
import { calculateCarbonScore } from '@/lib/carbon/math';
import type { OnboardingData } from '@/types';
import type { CategoryBreakdown } from '@/lib/carbon/types';

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

const highBreakdown: CategoryBreakdown = {
  transport: 3200,
  food: 2800,
  home: 2800,
  travel: 3500,
  shopping: 2200,
};

const lowBreakdown: CategoryBreakdown = {
  transport: 80,
  food: 800,
  home: 348,
  travel: 300,
  shopping: 400,
};

describe('buildRecommendedActions', () => {
  it('returns exactly 4 actions', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    expect(actions).toHaveLength(4);
  });

  it('returns exactly 4 actions for low-impact profile', () => {
    const actions = buildRecommendedActions(lowImpactProfile, 'food');
    expect(actions).toHaveLength(4);
  });

  it('sorts actions by annual savings descending', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    for (let i = 0; i < actions.length - 1; i++) {
      expect(actions[i].annualSavingsKg).toBeGreaterThanOrEqual(
        actions[i + 1].annualSavingsKg
      );
    }
  });

  it('each action has required fields', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    for (const action of actions) {
      expect(typeof action.id).toBe('string');
      expect(action.id.length).toBeGreaterThan(0);
      expect(typeof action.title).toBe('string');
      expect(typeof action.description).toBe('string');
      expect(typeof action.annualSavingsKg).toBe('number');
      expect(action.annualSavingsKg).toBeGreaterThan(0);
      expect(['Easy', 'Medium', 'Focused']).toContain(action.difficulty);
      expect(typeof action.firstStep).toBe('string');
      expect(typeof action.reason).toBe('string');
      expect(typeof action.successMetric).toBe('string');
      expect(['transport', 'food', 'home', 'travel', 'shopping']).toContain(
        action.category
      );
    }
  });

  it('generates car-specific action when transport is car', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    const transportAction = actions.find((a) => a.id === 'car-to-transit');
    expect(transportAction).toBeDefined();
  });

  it('generates bike-specific action when transport is bike', () => {
    const actions = buildRecommendedActions(lowImpactProfile, 'transport');
    const protectAction = actions.find(
      (a) => a.id === 'protect-low-carbon-mobility'
    );
    expect(protectAction).toBeDefined();
  });

  it('generates meat-heavy action for meat-heavy diet', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'food');
    const meatAction = actions.find((a) => a.id === 'reduce-red-meat');
    expect(meatAction).toBeDefined();
  });

  it('includes a motivation-specific action for profiles where it ranks in top 4', () => {
    const motivationIds = [
      'focus-biggest-lever',
      'bill-saving-stack',
      'travel-budget',
      'consumption-budget',
    ];
    const profile: OnboardingData = {
      ...lowImpactProfile,
      motivation: 'lower-bills',
    };
    const actions = buildRecommendedActions(profile, 'food');
    const hasMotivationAction = actions.some((a) => motivationIds.includes(a.id));
    expect(hasMotivationAction).toBe(true);
  });

  it('returns 4 actions regardless of whether motivation bonus makes the cut', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    expect(actions).toHaveLength(4);
    actions.forEach((a) => {
      expect(a.annualSavingsKg).toBeGreaterThan(0);
    });
  });

  it('all action IDs are unique', () => {
    const actions = buildRecommendedActions(highImpactProfile, 'transport');
    const ids = actions.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('handles all motivation types', () => {
    const motivations: OnboardingData['motivation'][] = [
      'shrink-footprint',
      'lower-bills',
      'travel-smarter',
      'consume-less',
    ];
    for (const motivation of motivations) {
      const actions = buildRecommendedActions(
        { ...highImpactProfile, motivation },
        'transport'
      );
      expect(actions).toHaveLength(4);
    }
  });
});

describe('buildTwinProfile', () => {
  const actions = buildRecommendedActions(highImpactProfile, 'travel');

  it('returns a twin with required fields', () => {
    const twin = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(typeof twin.name).toBe('string');
    expect(typeof twin.ownerName).toBe('string');
    expect(typeof twin.personality).toBe('string');
    expect(typeof twin.archetype).toBe('string');
    expect(Array.isArray(twin.traits)).toBe(true);
    expect(typeof twin.summary).toBe('string');
    expect(typeof twin.avatarCode).toBe('string');
    expect(typeof twin.dominantCategory).toBe('string');
    expect(typeof twin.signal).toBe('string');
  });

  it('uses first name from input', () => {
    const twin = buildTwinProfile(
      { ...highImpactProfile, name: 'John Smith' },
      highBreakdown,
      actions
    );
    expect(twin.ownerName).toBe('John');
  });

  it('twin name is in Prefix-Suffix format', () => {
    const twin = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(twin.name).toMatch(/^[A-Za-z]+-[A-Za-z]+$/);
  });

  it('avatar code matches CT-XX format', () => {
    const twin = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(twin.avatarCode).toMatch(/^CT-\d{2}$/);
  });

  it('dominant category is the highest breakdown key', () => {
    const twin = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(twin.dominantCategory).toBe('travel');
  });

  it('traits is a non-empty array with up to 3 entries', () => {
    const twin = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(twin.traits.length).toBeGreaterThanOrEqual(1);
    expect(twin.traits.length).toBeLessThanOrEqual(3);
  });

  it('produces deterministic output for same inputs', () => {
    const twin1 = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    const twin2 = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    expect(twin1.name).toBe(twin2.name);
    expect(twin1.avatarCode).toBe(twin2.avatarCode);
  });

  it('produces different output for different user names', () => {
    const twin1 = buildTwinProfile(highImpactProfile, highBreakdown, actions);
    const twin2 = buildTwinProfile(
      { ...highImpactProfile, name: 'ZZZ' },
      highBreakdown,
      actions
    );
    expect(twin1.name).not.toBe(twin2.name);
  });

  it('includes low-impact traits for eco-friendly choices', () => {
    const ecoActions = buildRecommendedActions(lowImpactProfile, 'food');
    const twin = buildTwinProfile(lowImpactProfile, lowBreakdown, ecoActions);
    const allTraits = twin.traits.join(' ');
    expect(
      twin.traits.some((t) =>
        ['Low-carbon commuter', 'Plant-forward', 'Intentional traveler', 'Mindful spender'].includes(t)
      )
    ).toBe(true);
    expect(allTraits.length).toBeGreaterThan(0);
  });
});

describe('buildCarbonProfile', () => {
  it('returns profile with all required string fields', () => {
    const profile = buildCarbonProfile(highImpactProfile, highBreakdown);
    expect(typeof profile.headline).toBe('string');
    expect(typeof profile.summary).toBe('string');
    expect(typeof profile.topChallenge).toBe('string');
    expect(typeof profile.strongestHabit).toBe('string');
    expect(typeof profile.coachMode).toBe('string');
    expect(typeof profile.householdContext).toBe('string');
  });

  it('all fields are non-empty', () => {
    const profile = buildCarbonProfile(highImpactProfile, highBreakdown);
    expect(profile.headline.length).toBeGreaterThan(0);
    expect(profile.summary.length).toBeGreaterThan(0);
    expect(profile.topChallenge.length).toBeGreaterThan(0);
    expect(profile.strongestHabit.length).toBeGreaterThan(0);
    expect(profile.coachMode.length).toBeGreaterThan(0);
    expect(profile.householdContext.length).toBeGreaterThan(0);
  });

  it('headline references the dominant category', () => {
    const profile = buildCarbonProfile(highImpactProfile, highBreakdown);
    expect(profile.headline.toLowerCase()).toContain('travel');
  });

  it('works for low-impact profile', () => {
    const profile = buildCarbonProfile(lowImpactProfile, lowBreakdown);
    expect(typeof profile.headline).toBe('string');
    expect(profile.headline.length).toBeGreaterThan(0);
  });

  it('handles all transport types without error', () => {
    const transports: OnboardingData['transport'][] = [
      'car', 'mixed', 'transit', 'bike', 'walk',
    ];
    for (const transport of transports) {
      const profile = buildCarbonProfile(
        { ...highImpactProfile, transport },
        highBreakdown
      );
      expect(typeof profile.strongestHabit).toBe('string');
    }
  });

  it('handles all household types', () => {
    const households: OnboardingData['household'][] = ['solo', 'couple', 'family'];
    for (const household of households) {
      const profile = buildCarbonProfile(
        { ...highImpactProfile, household },
        highBreakdown
      );
      expect(profile.householdContext.length).toBeGreaterThan(0);
    }
  });
});

describe('buildCoachingInsights', () => {
  const actions = buildRecommendedActions(highImpactProfile, 'transport');
  const annualKg = 14500;
  const dailyKg = parseFloat((annualKg / 365).toFixed(1));
  const topAction = actions[0];

  it('returns exactly 3 coaching insights', () => {
    const insights = buildCoachingInsights(
      highImpactProfile,
      annualKg,
      dailyKg,
      DAILY_BUDGET_KG,
      'transport',
      topAction
    );
    expect(insights).toHaveLength(3);
  });

  it('each insight has required fields', () => {
    const insights = buildCoachingInsights(
      highImpactProfile,
      annualKg,
      dailyKg,
      DAILY_BUDGET_KG,
      'transport',
      topAction
    );
    for (const insight of insights) {
      expect(typeof insight.id).toBe('string');
      expect(['encouraging', 'warning', 'opportunity']).toContain(insight.tone);
      expect(typeof insight.title).toBe('string');
      expect(typeof insight.description).toBe('string');
      expect(typeof insight.cta).toBe('string');
      expect(insight.title.length).toBeGreaterThan(0);
      expect(insight.description.length).toBeGreaterThan(0);
      expect(insight.cta.length).toBeGreaterThan(0);
    }
  });

  it('uses warning tone when over daily budget', () => {
    const insights = buildCoachingInsights(
      highImpactProfile,
      annualKg,
      50,
      DAILY_BUDGET_KG,
      'transport',
      topAction
    );
    expect(insights[0].tone).toBe('warning');
  });

  it('uses encouraging tone when under daily budget', () => {
    const lowDailyKg = 1;
    const insights = buildCoachingInsights(
      lowImpactProfile,
      1500,
      lowDailyKg,
      DAILY_BUDGET_KG,
      'food',
      topAction
    );
    expect(insights[0].tone).toBe('encouraging');
  });

  it('always includes an opportunity tone insight', () => {
    const insights = buildCoachingInsights(
      highImpactProfile,
      annualKg,
      dailyKg,
      DAILY_BUDGET_KG,
      'transport',
      topAction
    );
    expect(insights.some((i) => i.tone === 'opportunity')).toBe(true);
  });

  it('IDs are unique', () => {
    const insights = buildCoachingInsights(
      highImpactProfile,
      annualKg,
      dailyKg,
      DAILY_BUDGET_KG,
      'transport',
      topAction
    );
    const ids = insights.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('works for all categories', () => {
    const categories: Array<'transport' | 'food' | 'home' | 'travel' | 'shopping'> = [
      'transport', 'food', 'home', 'travel', 'shopping',
    ];
    for (const category of categories) {
      const insights = buildCoachingInsights(
        highImpactProfile,
        annualKg,
        dailyKg,
        DAILY_BUDGET_KG,
        category,
        topAction
      );
      expect(insights).toHaveLength(3);
    }
  });
});
