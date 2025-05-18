/**
 * Clamps a value between a minimum and maximum value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculates if a panel should be hidden based on its width
 */
export function shouldHidePanel(width: number, threshold = 300): boolean {
  return width < threshold
}

/**
 * Calculates the new width for a panel during resize
 */
export function calculatePanelWidth(initialWidth: number, mouseDelta: number, minWidth = 200, maxWidth = 600): number {
  return clamp(initialWidth + mouseDelta, minWidth, maxWidth)
}
