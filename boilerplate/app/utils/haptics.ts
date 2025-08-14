// Safe haptics wrapper. Uses expo-haptics if available; otherwise no-ops.
// Keep UX hooks without adding a hard dependency.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let H: any = null
try {
  // Dynamically require so builds work without expo-haptics installed
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  H = require("expo-haptics")
} catch (_e) {
  H = null
}

export const impactLight = () => {
  if (H?.impactAsync && H?.ImpactFeedbackStyle) {
    H.impactAsync(H.ImpactFeedbackStyle.Light)
  }
}

export const impactMedium = () => {
  if (H?.impactAsync && H?.ImpactFeedbackStyle) {
    H.impactAsync(H.ImpactFeedbackStyle.Medium)
  }
}

export const impactHeavy = () => {
  if (H?.impactAsync && H?.ImpactFeedbackStyle) {
    H.impactAsync(H.ImpactFeedbackStyle.Heavy)
  }
}

export const hapticsAvailable = Boolean(H?.impactAsync)


