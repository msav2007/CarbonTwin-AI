export function sanitizeNameInput(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9\s'.-]/g, "");
}

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
