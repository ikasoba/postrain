import styles from "./bubble.module.css";

export function Bubble({ authorName, message }: { authorName: string, message: string }) {
  return (
    <div className={`${styles.bubble} ${styles.bubbleBounce}`}>
      <div className={`${styles.bubbleContent} flex flex-col gap-1`}>
        <span className="text-gray-500 text-sm border-b border-gray-400">
          {authorName}
        </span>
        <p>{message}</p>
      </div>
    </div>
  )
}
