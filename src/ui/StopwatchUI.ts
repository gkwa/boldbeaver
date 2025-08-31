export class StopwatchUI {
  private currentTimestampDisplay: HTMLElement | null = null
  private startTimestampDisplay: HTMLElement | null = null
  private timeDisplay: HTMLElement | null = null
  private stopwatchDurationDisplay: HTMLElement | null = null
  private sessionDurationDisplay: HTMLElement | null = null
  private startBtn: HTMLElement | null = null
  private stopBtn: HTMLElement | null = null
  private resetBtn: HTMLElement | null = null

  public render(): void {
    const app = document.getElementById("app")
    if (!app) return

    app.innerHTML = `
      <div class="current-timestamp-display">--</div>
      <div class="start-timestamp-display" style="display: none;">Started: --</div>
      <div class="time-display">00:00</div>
      <div class="stopwatch-duration-display">Active: 0s</div>
      <div class="session-duration-display" style="display: none;">Session: 0s</div>
      <div class="controls">
        <button class="btn btn-start">START</button>
        <button class="btn btn-stop">STOP</button>
        <button class="btn btn-reset">RESET</button>
      </div>
    `

    this.cacheElements()
    this.setupDynamicSizing()

    window.addEventListener("resize", () => this.setupDynamicSizing())
  }

  private setupDynamicSizing(): void {
    const elements = [
      this.timeDisplay,
      this.stopwatchDurationDisplay,
      this.sessionDurationDisplay,
      this.currentTimestampDisplay,
      this.startTimestampDisplay,
    ]
    if (elements.some((el) => !el)) return

    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth - 20

    const showingStartTime = this.startTimestampDisplay!.style.display !== "none"
    const showingSessionTime = this.sessionDurationDisplay!.style.display !== "none"

    const controlsSpace = viewportHeight * 0.18
    const availableHeight = viewportHeight - controlsSpace

    let elementCount = 3 // timer + stopwatch duration + current timestamp
    if (showingStartTime) elementCount++
    if (showingSessionTime) elementCount++

    // Distribute space proportionally
    const timeHeight = availableHeight * 0.4
    const stopwatchHeight = availableHeight * 0.25
    const sessionHeight = showingSessionTime ? availableHeight * 0.2 : 0
    const currentTimestampHeight = availableHeight * 0.1
    const startTimestampHeight = showingStartTime ? availableHeight * 0.05 : 0

    // Calculate and apply font sizes
    const timeFontSize = this.fitTextToWidth(
      this.timeDisplay!,
      Math.max(timeHeight, 50),
      viewportWidth,
      "9999:99",
    )
    const stopwatchFontSize = this.fitTextToWidth(
      this.stopwatchDurationDisplay!,
      Math.max(stopwatchHeight, 20),
      viewportWidth,
      "Active: 99d23h59m (999:59:59)",
    )
    const currentTimestampFontSize = this.fitTextToWidth(
      this.currentTimestampDisplay!,
      Math.max(currentTimestampHeight, 12),
      viewportWidth,
      "Sun, Aug 31, 2025 08:30:28 (08:30:28 AM)",
    )

    this.timeDisplay!.style.fontSize = `${timeFontSize}px`
    this.stopwatchDurationDisplay!.style.fontSize = `${stopwatchFontSize}px`
    this.currentTimestampDisplay!.style.fontSize = `${currentTimestampFontSize}px`

    if (showingSessionTime) {
      const sessionFontSize = this.fitTextToWidth(
        this.sessionDurationDisplay!,
        Math.max(sessionHeight, 18),
        viewportWidth,
        "Session: 99d23h59m (999:59:59)",
      )
      this.sessionDurationDisplay!.style.fontSize = `${sessionFontSize}px`
    }

    if (showingStartTime) {
      const startTimestampFontSize = this.fitTextToWidth(
        this.startTimestampDisplay!,
        Math.max(startTimestampHeight, 10),
        viewportWidth,
        "Started: Sun, Aug 31, 2025 08:30:28 (08:30:28 AM)",
      )
      this.startTimestampDisplay!.style.fontSize = `${startTimestampFontSize}px`
    }
  }

  private fitTextToWidth(
    element: HTMLElement,
    startSize: number,
    maxWidth: number,
    sampleText: string,
  ): number {
    const tempElement = element.cloneNode(true) as HTMLElement
    tempElement.style.visibility = "hidden"
    tempElement.style.position = "absolute"
    tempElement.style.top = "-9999px"
    tempElement.style.fontSize = `${startSize}px`
    tempElement.textContent = sampleText

    document.body.appendChild(tempElement)

    let fontSize = startSize
    while (tempElement.offsetWidth > maxWidth && fontSize > 8) {
      fontSize -= 1
      tempElement.style.fontSize = `${fontSize}px`
    }

    document.body.removeChild(tempElement)
    return fontSize
  }

  public updateDisplay(time: string): void {
    if (this.timeDisplay) {
      this.timeDisplay.textContent = time
    }
  }

  public updateStopwatchDuration(duration: string): void {
    if (this.stopwatchDurationDisplay) {
      this.stopwatchDurationDisplay.textContent = `Active: ${duration}`
    }
  }

  public updateSessionDuration(duration: string, show: boolean): void {
    if (this.sessionDurationDisplay) {
      this.sessionDurationDisplay.textContent = `Session: ${duration}`
      this.sessionDurationDisplay.style.display = show ? "flex" : "none"
      this.setupDynamicSizing()
    }
  }

  public updateCurrentTimestamp(timestamp: string): void {
    if (this.currentTimestampDisplay) {
      this.currentTimestampDisplay.textContent = timestamp
    }
  }

  public updateStartTimestamp(timestamp: string, show: boolean): void {
    if (this.startTimestampDisplay) {
      this.startTimestampDisplay.textContent = `Started: ${timestamp}`
      this.startTimestampDisplay.style.display = show ? "flex" : "none"
      this.setupDynamicSizing()
    }
  }

  public onStart(callback: () => void): void {
    if (this.startBtn) {
      this.startBtn.addEventListener("click", callback)
    }
  }

  public onStop(callback: () => void): void {
    if (this.stopBtn) {
      this.stopBtn.addEventListener("click", callback)
    }
  }

  public onReset(callback: () => void): void {
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", callback)
    }
  }

  private cacheElements(): void {
    this.timeDisplay = document.querySelector(".time-display")
    this.stopwatchDurationDisplay = document.querySelector(".stopwatch-duration-display")
    this.sessionDurationDisplay = document.querySelector(".session-duration-display")
    this.currentTimestampDisplay = document.querySelector(".current-timestamp-display")
    this.startTimestampDisplay = document.querySelector(".start-timestamp-display")
    this.startBtn = document.querySelector(".btn-start")
    this.stopBtn = document.querySelector(".btn-stop")
    this.resetBtn = document.querySelector(".btn-reset")
  }
}
