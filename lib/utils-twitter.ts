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
  tweetEmpathyScore: number,  // Now 0-100 range (was 0-1)
  isToxic: boolean = false
): number {
  let newScore = currentScore;

  // Both currentScore and tweetEmpathyScore are now in 0-100 range
  if (isToxic || tweetEmpathyScore < 30) {
    const decreaseAmount = isToxic ? 8 : Math.max(2, Math.round((30 - tweetEmpathyScore) / 10));
    newScore = Math.max(0, currentScore - decreaseAmount);
  } else if (tweetEmpathyScore >= 70) {
    const increaseAmount = Math.round(3 + (tweetEmpathyScore - 70) / 10);
    newScore = Math.min(100, currentScore + increaseAmount);
  } else if (tweetEmpathyScore >= 50) {
    const increaseAmount = Math.round(1 + (tweetEmpathyScore - 50) / 10);
    newScore = Math.min(100, currentScore + increaseAmount);
  } else {
    const decreaseAmount = Math.round((50 - tweetEmpathyScore) / 25);
    newScore = Math.max(0, currentScore - decreaseAmount);
  }

  return Math.max(0, Math.min(100, newScore));
}
