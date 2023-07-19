export function getEmoji(
  numberOfTokes: number,
  pastNumberOfTokes: number = 0
): string {
  if (numberOfTokes === 0) {
    return '🙂'
  }
  if (numberOfTokes !== 0 && pastNumberOfTokes === 0) {
    return '🤔'
  }
  switch (true) {
    case numberOfTokes > pastNumberOfTokes * 2:
      return '☠️'
    case numberOfTokes > pastNumberOfTokes:
      return '🤬'
    case numberOfTokes === pastNumberOfTokes:
      return '🥵'
    case numberOfTokes >= pastNumberOfTokes - 3:
      return '🥺'
    case numberOfTokes > Math.round(pastNumberOfTokes / 2) - 2:
      return '🤔'
    case numberOfTokes <= Math.round(pastNumberOfTokes / 2) + 2 &&
      numberOfTokes >= Math.round(pastNumberOfTokes / 2) - 2:
      return '😳'
    case numberOfTokes < pastNumberOfTokes:
    default:
      return '🙂'
  }
}
