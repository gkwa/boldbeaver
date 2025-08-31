export class TimestampFormatter {
  public getCurrentTimestamp(): string {
    const now = new Date()
    return this.formatDate(now)
  }

  public formatDate(date: Date): string {
    const dateStr = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
    })

    const time24h = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })

    const time12h = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })

    return `${dateStr} ${time24h} (${time12h})`
  }
}
