export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#[\w]+/g
  return (text.match(hashtagRegex) || []).map((tag) => tag.substring(1).toLowerCase())
}

export function extractMentions(text: string): string[] {
  const mentionRegex = /@[\w]+/g
  return (text.match(mentionRegex) || []).map((mention) => mention.substring(1).toLowerCase())
}

export function generateTrendingTopics(hashtags: Array<{ tag: string; count: number }>) {
  return hashtags.sort((a, b) => b.count - a.count).slice(0, 10)
}

export function formatTweetDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return "now"
  if (minutes < 60) return `${minutes}m`
  if (hours < 24) return `${hours}h`
  if (days < 7) return `${days}d`
  return new Date(date).toLocaleDateString()
}

export function truncateText(text: string, length = 100): string {
  return text.length > length ? text.substring(0, length) + "..." : text
}

export function calculateNewEmpathyScore(
  currentScore: number,
  empathyScore: number,
  isToxic: boolean = false
): number {
  let newScore = currentScore;

  if (isToxic || empathyScore < 0.3) {
    const decreaseAmount = isToxic ? 8 : Math.max(2, Math.round((0.3 - empathyScore) * 10));
    newScore = Math.max(0, currentScore - decreaseAmount);
  } else if (empathyScore >= 0.7) {
    const increaseAmount = Math.round(3 + (empathyScore - 0.7) * 6);
    newScore = Math.min(100, currentScore + increaseAmount);
  } else if (empathyScore >= 0.5) {
    const increaseAmount = Math.round(1 + (empathyScore - 0.5) * 5);
    newScore = Math.min(100, currentScore + increaseAmount);
  } else {
    const decreaseAmount = Math.round((0.5 - empathyScore) * 2);
    newScore = Math.max(0, currentScore - decreaseAmount);
  }

  return Math.max(0, Math.min(100, newScore));
}
