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
    this.setupResponsiveSizing()
  }

  private setupResponsiveSizing(): void {
    if (
      !this.stopwatchDurationDisplay ||
      !this.sessionDurationDisplay ||
      !this.currentTimestampDisplay ||
      !this.startTimestampDisplay ||
      !this.legendDisplay
    )
      return

    // Use viewport-based sizing like the working HTML version
    this.stopwatchDurationDisplay.style.fontSize = "8vw"
    this.sessionDurationDisplay.style.fontSize = "6vw"
    this.legendDisplay.style.fontSize = "3vw"
    this.currentTimestampDisplay.style.fontSize = "2.5vw"
    this.startTimestampDisplay.style.fontSize = "2vw"

    // Add responsive breakpoint for very small screens
    const addResponsiveStyles = () => {
      if (window.innerWidth <= 320) {
        this.stopwatchDurationDisplay!.style.fontSize = "12vw"
        this.sessionDurationDisplay!.style.fontSize = "8vw"
        this.legendDisplay!.style.fontSize = "4vw"
        this.currentTimestampDisplay!.style.fontSize = "3.5vw"
        this.startTimestampDisplay!.style.fontSize = "3vw"
      } else {
        this.stopwatchDurationDisplay!.style.fontSize = "8vw"
        this.sessionDurationDisplay!.style.fontSize = "6vw"
        this.legendDisplay!.style.fontSize = "3vw"
        this.currentTimestampDisplay!.style.fontSize = "2.5vw"
        this.startTimestampDisplay!.style.fontSize = "2vw"
      }
    }

    addResponsiveStyles()
    window.addEventListener("resize", addResponsiveStyles)
  }

  public updateToggleButton(isRunning: boolean): void {
    if (!this.toggleBtn) return

    if (isRunning) {
      this.toggleBtn.textContent = "STOP"
      this.toggleBtn.className = "btn btn-toggle btn-stop"
    } else {
      this.toggleBtn.textContent = "START"
      this.toggleBtn.className = "btn btn-toggle btn-start"
    }
  }

  public updateStopwatchDuration(duration: string): void {
    if (!this.stopwatchDurationDisplay) return
    this.stopwatchDurationDisplay.textContent = duration
  }

  public updateSessionDuration(duration: string, show: boolean): void {
    if (!this.sessionDurationDisplay) return
    this.sessionDurationDisplay.textContent = duration
    this.sessionDurationDisplay.style.display = show ? "flex" : "none"
  }

  public updateCurrentTimestamp(timestamp: string): void {
    if (!this.currentTimestampDisplay) return
    this.currentTimestampDisplay.textContent = timestamp
  }

  public updateStartTimestamp(timestamp: string, show: boolean): void {
    if (!this.startTimestampDisplay) return
    this.startTimestampDisplay.textContent = `Started: ${timestamp}`
    this.startTimestampDisplay.style.display = show ? "flex" : "none"
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
    this.toggleBtn = document.querySelector(".btn-toggle") as HTMLButtonElement
    this.resetBtn = document.querySelector(".btn-reset") as HTMLButtonElement
    this.keepAwakeBtn = document.querySelector(".btn-keep-awake") as HTMLButtonElement
  }
}
