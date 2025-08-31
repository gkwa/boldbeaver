export class DurationFormatter {
  public format(milliseconds: number): string {
    if (milliseconds < 1000) {
      return "0s"
    }

    const totalSeconds = Math.floor(milliseconds / 1000)

    // For times over 1 hour, also show HH:MM:SS format
    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60
      const timeFormat = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

      // Calculate human-readable format with days
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)

      if (totalDays > 0) {
        const remainingHours = totalHours % 24
        const remainingMinutes = totalMinutes % 60

        const parts: string[] = []
        parts.push(`${totalDays}d`)
        if (remainingHours > 0) {
          parts.push(`${remainingHours}h`)
        }
        if (remainingMinutes > 0) {
          parts.push(`${remainingMinutes}m`)
        }

        return `${parts.join("")} (${timeFormat})`
      } else {
        const remainingMinutes = totalMinutes % 60

        const parts: string[] = []
        parts.push(`${totalHours}h`)
        if (remainingMinutes > 0) {
          parts.push(`${remainingMinutes}m`)
        }

        return `${parts.join("")} (${timeFormat})`
      }
    }

    if (totalSeconds < 60) {
      return `${totalSeconds}s`
    }

    const totalMinutes = Math.floor(totalSeconds / 60)
    const remainingSeconds = totalSeconds % 60

    if (remainingSeconds > 0) {
      return `${totalMinutes}m${remainingSeconds}s`
    }
    return `${totalMinutes}m`
  }
}
