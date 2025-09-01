export class StopwatchUI {
  private currentTimestampDisplay: HTMLElement | null = null
  private startTimestampDisplay: HTMLElement | null = null
  private stopwatchDurationDisplay: HTMLElement | null = null
  private sessionDurationDisplay: HTMLElement | null = null
  private legendDisplay: HTMLElement | null = null
  private toggleBtn: HTMLButtonElement | null = null
  private resetBtn: HTMLButtonElement | null = null
  private keepAwakeBtn: HTMLButtonElement | null = null

  public render(): void {
    const app = document.getElementById("app")
    if (!app) return

    app.innerHTML = `
      <div class="controls">
        <button class="btn btn-toggle btn-start">START</button>
        <button class="btn btn-keep-awake">Keep Awake</button>
        <button class="btn btn-reset">RESET</button>
      </div>
      <div class="current-timestamp-display">--</div>
      <div class="start-timestamp-display" style="display: none;">Started: --</div>
      <div class="legend-display">🟢 Active • 🟡 Session</div>
      <div class="stopwatch-duration-display">0s</div>
      <div class="session-duration-display" style="display: none;">0s</div>
    `

    this.cacheElements()
    this.setupDynamicSizing()

    window.addEventListener("resize", () => this.setupDynamicSizing())
  }

  private setupDynamicSizing(): void {
    const elements = [
      this.stopwatchDurationDisplay,
      this.sessionDurationDisplay,
      this.currentTimestampDisplay,
      this.startTimestampDisplay,
      this.legendDisplay,
    ]
    if (elements.some((el) => !el)) return

    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth - 20

    const showingStartTime = this.startTimestampDisplay!.style.display !== "none"
    const showingSessionTime = this.sessionDurationDisplay!.style.display !== "none"

    const controlsSpace = viewportHeight * 0.15
    const availableHeight = viewportHeight - controlsSpace

    // Calculate space allocation
    const currentTimestampHeight = availableHeight * 0.1
    const startTimestampHeight = showingStartTime ? availableHeight * 0.06 : 0
    const legendHeight = availableHeight * 0.08

    let timerSpace = availableHeight - currentTimestampHeight - startTimestampHeight - legendHeight

    if (showingSessionTime) {
      // Split timer space between active and session
      const activeHeight = timerSpace * 0.5
      const sessionHeight = timerSpace * 0.5

      const activeFontSize = this.fitTextToWidth(
        this.stopwatchDurationDisplay!,
        Math.max(activeHeight, 30),
        viewportWidth,
        "99d23h59m",
      )
      const sessionFontSize = this.fitTextToWidth(
        this.sessionDurationDisplay!,
        Math.max(sessionHeight, 30),
        viewportWidth,
        "99d23h59m",
      )

      this.stopwatchDurationDisplay!.style.fontSize = `${activeFontSize}px`
      this.sessionDurationDisplay!.style.fontSize = `${sessionFontSize}px`
    } else {
      // Use full timer space for active only
      const activeFontSize = this.fitTextToWidth(
        this.stopwatchDurationDisplay!,
        Math.max(timerSpace, 50),
        viewportWidth,
        "99d23h59m",
      )
      this.stopwatchDurationDisplay!.style.fontSize = `${activeFontSize}px`
    }

    // Set other element sizes
    const currentTimestampFontSize = this.fitTextToWidth(
      this.currentTimestampDisplay!,
      Math.max(currentTimestampHeight, 12),
      viewportWidth,
      "Sun, Aug 31, 2025 08:30:28 (08:30:28 AM)",
    )
    this.currentTimestampDisplay!.style.fontSize = `${currentTimestampFontSize}px`

    const legendFontSize = this.fitTextToWidth(
      this.legendDisplay!,
      Math.max(legendHeight, 10),
      viewportWidth,
      "🟢 Active • 🟡 Session",
    )
    this.legendDisplay!.style.fontSize = `${legendFontSize}px`

    if (!showingStartTime) return

    const startTimestampFontSize = this.fitTextToWidth(
      this.startTimestampDisplay!,
      Math.max(startTimestampHeight, 10),
      viewportWidth,
      "Started: Sun, Aug 31, 2025 08:30:28 (08:30:28 AM)",
    )
    this.startTimestampDisplay!.style.fontSize = `${startTimestampFontSize}px`
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

  public updateToggleButton(isRunning: boolean): void {
    if (!this.toggleBtn) return

    if (isRunning) {
      this.toggleBtn.textContent = "STOP"
      this.toggleBtn.className = "btn btn-toggle btn-stop"
      return
    }

    this.toggleBtn.textContent = "START"
    this.toggleBtn.className = "btn btn-toggle btn-start"
  }

  public updateStopwatchDuration(duration: string): void {
    if (!this.stopwatchDurationDisplay) return
    this.stopwatchDurationDisplay.textContent = duration
  }

  public updateSessionDuration(duration: string, show: boolean): void {
    if (!this.sessionDurationDisplay) return

    this.sessionDurationDisplay.textContent = duration
    this.sessionDurationDisplay.style.display = show ? "flex" : "none"
    this.setupDynamicSizing()
  }

  public updateCurrentTimestamp(timestamp: string): void {
    if (!this.currentTimestampDisplay) return
    this.currentTimestampDisplay.textContent = timestamp
  }

  public updateStartTimestamp(timestamp: string, show: boolean): void {
    if (!this.startTimestampDisplay) return

    this.startTimestampDisplay.textContent = `Started: ${timestamp}`
    this.startTimestampDisplay.style.display = show ? "flex" : "none"
    this.setupDynamicSizing()
  }

  public updateKeepAwakeButton(enabled: boolean): void {
    if (!this.keepAwakeBtn) return

    this.keepAwakeBtn.textContent = enabled ? "Allow Sleep" : "Keep Awake"
    this.keepAwakeBtn.classList.toggle("active", enabled)
  }

  public disableKeepAwakeButton(): void {
    if (!this.keepAwakeBtn) return

    this.keepAwakeBtn.disabled = true
    this.keepAwakeBtn.textContent = "Keep Awake (Unsupported)"
    this.keepAwakeBtn.style.background = "#6b7280"
  }

  public onToggle(callback: () => void): void {
    if (!this.toggleBtn) return
    this.toggleBtn.addEventListener("click", callback)
  }

  public onReset(callback: () => void): void {
    if (!this.resetBtn) return
    this.resetBtn.addEventListener("click", callback)
  }

  public onKeepAwake(callback: () => void): void {
    if (!this.keepAwakeBtn) return
    this.keepAwakeBtn.addEventListener("click", callback)
  }

  private cacheElements(): void {
    this.stopwatchDurationDisplay = document.querySelector(".stopwatch-duration-display")
    this.sessionDurationDisplay = document.querySelector(".session-duration-display")
    this.currentTimestampDisplay = document.querySelector(".current-timestamp-display")
    this.startTimestampDisplay = document.querySelector(".start-timestamp-display")
    this.legendDisplay = document.querySelector(".legend-display")
    this.toggleBtn = document.querySelector(".btn-toggle")
    this.resetBtn = document.querySelector(".btn-reset")
    this.keepAwakeBtn = document.querySelector(".btn-keep-awake")
  }
}
