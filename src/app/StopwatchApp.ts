import { Stopwatch } from "../domain/Stopwatch"
import { DurationFormatter } from "../services/DurationFormatter"
import { TimestampFormatter } from "../services/TimestampFormatter"
import { StopwatchUI } from "../ui/StopwatchUI"

export class StopwatchApp {
  private stopwatch: Stopwatch
  private durationFormatter: DurationFormatter
  private timestampFormatter: TimestampFormatter
  private ui: StopwatchUI
  private isKeepAwakeEnabled: boolean = false
  private wakeLock: WakeLockSentinel | null = null

  constructor() {
    this.stopwatch = new Stopwatch()
    this.durationFormatter = new DurationFormatter()
    this.timestampFormatter = new TimestampFormatter()
    this.ui = new StopwatchUI()
  }

  public init(): void {
    this.ui.render()
    this.setupEventHandlers()
    this.setupVisibilityChangeHandler()
    this.startUpdateLoop()
    this.updateAllDisplays()

    if (!("wakeLock" in navigator)) {
      this.ui.disableKeepAwakeButton()
    }
  }

  private setupEventHandlers(): void {
    this.ui.onToggle(() => {
      if (this.stopwatch.getIsRunning()) {
        this.stopwatch.stop()
      } else {
        this.stopwatch.start()
      }
      this.ui.updateToggleButton(this.stopwatch.getIsRunning())
    })

    this.ui.onReset(() => {
      this.stopwatch.reset()
      this.ui.updateToggleButton(this.stopwatch.getIsRunning())
      this.updateAllDisplays()
    })

    this.ui.onKeepAwake(() => {
      this.toggleKeepAwake()
    })
  }

  private setupVisibilityChangeHandler(): void {
    document.addEventListener("visibilitychange", async () => {
      if (
        this.isKeepAwakeEnabled &&
        this.wakeLock === null &&
        document.visibilityState === "visible"
      ) {
        await this.requestWakeLock()
      }
    })
  }

  private async toggleKeepAwake(): Promise<void> {
    this.isKeepAwakeEnabled = !this.isKeepAwakeEnabled
    if (this.isKeepAwakeEnabled) {
      await this.requestWakeLock()
      this.ui.updateKeepAwakeButton(true)
    } else {
      await this.releaseWakeLock()
      this.ui.updateKeepAwakeButton(false)
    }
  }

  private async requestWakeLock(): Promise<void> {
    if (this.wakeLock) return
    try {
      this.wakeLock = await navigator.wakeLock.request("screen")
      this.wakeLock.addEventListener("release", () => {
        this.wakeLock = null
      })
    } catch (err) {
      console.error("Failed to acquire wake lock:", err)
      this.isKeepAwakeEnabled = false
      this.ui.updateKeepAwakeButton(false)
      // Optionally alert user
    }
  }

  private async releaseWakeLock(): Promise<void> {
    if (this.wakeLock) {
      await this.wakeLock.release()
      this.wakeLock = null
    }
  }

  private startUpdateLoop(): void {
    const update = () => {
      this.updateAllDisplays()
      requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }

  private updateAllDisplays(): void {
    const elapsed = this.stopwatch.getElapsed()

    // Stopwatch duration (active time only)
    const stopwatchDuration = this.durationFormatter.format(elapsed)
    this.ui.updateStopwatchDuration(stopwatchDuration)

    // Current timestamp
    const currentTimestamp = this.timestampFormatter.getCurrentTimestamp()
    this.ui.updateCurrentTimestamp(currentTimestamp)

    // Session info (if started)
    const sessionStartTime = this.stopwatch.getSessionStartTime()
    if (sessionStartTime && this.stopwatch.hasStarted()) {
      // Show start timestamp
      const startTimestamp = this.timestampFormatter.formatDate(sessionStartTime)
      this.ui.updateStartTimestamp(startTimestamp, true)

      // Calculate and show session duration (wall-clock time)
      const sessionElapsed = Date.now() - sessionStartTime.getTime()
      const sessionDuration = this.durationFormatter.format(sessionElapsed)
      this.ui.updateSessionDuration(sessionDuration, true)
    } else {
      this.ui.updateStartTimestamp("", false)
      this.ui.updateSessionDuration("", false)
    }
  }
}
