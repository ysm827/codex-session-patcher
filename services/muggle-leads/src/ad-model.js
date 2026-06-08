export const AD_FITS = new Set(["natural", "contain", "cover", "fill"]);
export const BILLING_TYPES = new Set(["one_time", "yearly", "monthly", "weekly", "daily"]);
export const DEFAULT_AD_WIDTH = "clamp(240px, 22vw, 420px)";
export const DEFAULT_AD_MAX_HEIGHT = "72vh";
export const DEFAULT_AD_BACKGROUND = "var(--color-bg-1)";
export const RATIO_WARNING_THRESHOLD = 0.08;

export function campaignStatus(campaign, nowIso = new Date().toISOString()) {
  if (!normalizeBool(campaign?.enabled)) {
    return campaign?.activated_at ? "disabled" : "draft";
  }
  if (!campaign?.start_at || !campaign?.end_at) {
    return "draft";
  }
  if (nowIso < campaign.start_at) {
    return "scheduled";
  }
  if (nowIso >= campaign.end_at) {
    return "expired";
  }
  return "running";
}

export function rangesOverlap(startA, endA, startB, endB) {
  if (!startA || !endA || !startB || !endB) return false;
  return startA < endB && startB < endA;
}

export function ratioDeviation(width, height, suggestedRatio) {
  const actual = Number(width) / Number(height);
  const expected = parseRatio(suggestedRatio);
  if (!Number.isFinite(actual) || !Number.isFinite(expected) || actual <= 0 || expected <= 0) {
    return 0;
  }
  return Math.abs(actual - expected) / expected;
}

export function parseRatio(value) {
  const match = String(value || "").trim().match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (!match) return 0;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return height > 0 ? width / height : 0;
}

export function shouldWarnRatio(width, height, suggestedRatio) {
  return ratioDeviation(width, height, suggestedRatio) > RATIO_WARNING_THRESHOLD;
}

export function beijingLocalToIso(value) {
  const match = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!match) return "";
  const [, year, month, day, hour, minute] = match.map(Number);
  return new Date(Date.UTC(year, month - 1, day, hour - 8, minute, 0, 0)).toISOString();
}

export function isoToBeijingLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const shifted = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return [
    shifted.getUTCFullYear(),
    pad(shifted.getUTCMonth() + 1),
    pad(shifted.getUTCDate()),
  ].join("-") + "T" + [pad(shifted.getUTCHours()), pad(shifted.getUTCMinutes())].join(":");
}

export function normalizeBillingType(value) {
  return BILLING_TYPES.has(value) ? value : "one_time";
}

export function normalizeFit(value, fallback = "natural") {
  return AD_FITS.has(value) ? value : fallback;
}

export function normalizeBool(value) {
  return value === true || value === 1 || value === "1";
}

export function clean(value, limit) {
  return String(value || "").trim().slice(0, limit);
}

function pad(value) {
  return String(value).padStart(2, "0");
}
