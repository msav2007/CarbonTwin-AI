/**
 * Sanitizes a display-name input by collapsing consecutive whitespace
 * and stripping characters that are not letters, digits, spaces,
 * apostrophes, hyphens, or periods.
 *
 * Safe to call on every keystroke — non-destructive for valid characters
 * and produces a string safe to render in the UI.
 *
 * @param value - Raw string from the input element
 * @returns Sanitized string; may still be empty or too short/long
 *
 * @example
 * sanitizeNameInput("  Alex  O'Brien  ") // → "Alex O'Brien"
 * sanitizeNameInput("Name<script>")       // → "Namescript"
 */
export function sanitizeNameInput(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9\s'.-]/g, "");
}

/**
 * Validates a display name before it is stored in the Carbon Twin profile.
 *
 * Rules:
 * - Must not be empty or only whitespace
 * - Must be at least 2 characters after trimming
 * - Must not exceed 32 characters after trimming
 *
 * @param value - Raw (unsanitized) name input
 * @returns `null` if the name is valid; a human-readable error string otherwise
 *
 * @example
 * validateDisplayName("")          // → "Add your name so CarbonTwin can personalize the reveal."
 * validateDisplayName("A")         // → "Use at least 2 characters for a readable twin profile."
 * validateDisplayName("Alexandra") // → null (valid)
 */
export function validateDisplayName(value: string): string | null {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Add your name so CarbonTwin can personalize the reveal.";
  }

  if (trimmed.length < 2) {
    return "Use at least 2 characters for a readable twin profile.";
  }

  if (trimmed.length > 32) {
    return "Keep the name under 32 characters for the reveal card.";
  }

  return null;
}
