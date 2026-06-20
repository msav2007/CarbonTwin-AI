import { describe, it, expect } from 'vitest';
import { sanitizeNameInput, validateDisplayName } from '@/lib/onboarding/validation';

describe('sanitizeNameInput', () => {
  it('collapses multiple spaces to one', () => {
    expect(sanitizeNameInput('hello  world')).toBe('hello world');
    expect(sanitizeNameInput('a   b   c')).toBe('a b c');
  });

  it('removes disallowed characters', () => {
    expect(sanitizeNameInput('hello@world')).toBe('helloworld');
    expect(sanitizeNameInput('name!')).toBe('name');
    expect(sanitizeNameInput('test#123')).toBe('test123');
  });

  it('preserves allowed special characters', () => {
    expect(sanitizeNameInput("O'Brien")).toBe("O'Brien");
    expect(sanitizeNameInput('Mary-Jane')).toBe('Mary-Jane');
    expect(sanitizeNameInput('Dr. Smith')).toBe('Dr. Smith');
  });

  it('preserves numbers and letters', () => {
    expect(sanitizeNameInput('User123')).toBe('User123');
    expect(sanitizeNameInput('Alex')).toBe('Alex');
  });

  it('handles empty string', () => {
    expect(sanitizeNameInput('')).toBe('');
  });

  it('preserves leading/trailing spaces (trimming is caller responsibility)', () => {
    expect(sanitizeNameInput('  hello  ')).toBe(' hello ');
  });
});

describe('validateDisplayName', () => {
  it('returns null for a valid name', () => {
    expect(validateDisplayName('Alex')).toBeNull();
    expect(validateDisplayName('Jo')).toBeNull();
    expect(validateDisplayName('John Doe')).toBeNull();
  });

  it('returns error for empty string', () => {
    const error = validateDisplayName('');
    expect(error).not.toBeNull();
    expect(typeof error).toBe('string');
    expect(error!.length).toBeGreaterThan(0);
  });

  it('returns error for whitespace-only string', () => {
    expect(validateDisplayName('   ')).not.toBeNull();
    expect(validateDisplayName('\t')).not.toBeNull();
  });

  it('returns error for single character name', () => {
    expect(validateDisplayName('A')).not.toBeNull();
  });

  it('returns null for exactly 2 characters', () => {
    expect(validateDisplayName('Jo')).toBeNull();
  });

  it('returns error for names over 32 characters', () => {
    const longName = 'a'.repeat(33);
    expect(validateDisplayName(longName)).not.toBeNull();
  });

  it('returns null for exactly 32 characters', () => {
    const maxName = 'a'.repeat(32);
    expect(validateDisplayName(maxName)).toBeNull();
  });

  it('trims before validating length', () => {
    expect(validateDisplayName('  A  ')).not.toBeNull();
    expect(validateDisplayName('  Jo  ')).toBeNull();
  });
});
