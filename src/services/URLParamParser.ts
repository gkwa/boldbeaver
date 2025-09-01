export class URLParamParser {
  public static parseStartOffset(): number {
    const urlParams = new URLSearchParams(window.location.search)
    const startParam = urlParams.get("start")

    if (!startParam) return 0

    return this.parseDurationString(startParam)
  }

  private static parseDurationString(duration: string): number {
    // Support formats like: 1d, 2h, 30m, 45s, 1d2h30m, etc.
    const regex = /(\d+)([dhms])/g
    let totalMs = 0
    let match

    while ((match = regex.exec(duration)) !== null) {
      const value = parseInt(match[1], 10)
      const unit = match[2]

      switch (unit) {
        case "d":
          totalMs += value * 24 * 60 * 60 * 1000
          break
        case "h":
          totalMs += value * 60 * 60 * 1000
          break
        case "m":
          totalMs += value * 60 * 1000
          break
        case "s":
          totalMs += value * 1000
          break
      }
    }

    return totalMs
  }

  public static getExampleUrls(): string[] {
    const baseUrl = window.location.origin + window.location.pathname
    return [
      `${baseUrl}?start=1d - Start with 1 day elapsed`,
      `${baseUrl}?start=2h30m - Start with 2.5 hours elapsed`,
      `${baseUrl}?start=45m - Start with 45 minutes elapsed`,
      `${baseUrl}?start=1d2h30m15s - Start with complex time elapsed`,
    ]
  }
}
