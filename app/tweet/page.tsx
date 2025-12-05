import { Suspense } from "react"
import { TweetDetailContent } from "@/components/tweet/tweet-detail-content"

export default function TweetPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center">
          Loading tweet...
        </div>
      }
    >
      <TweetDetailContent />
    </Suspense>
  )
}


