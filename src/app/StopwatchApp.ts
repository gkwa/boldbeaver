import { Stopwatch } from "../domain/Stopwatch"
import { TimeFormatter } from "../services/TimeFormatter"
import { DurationFormatter } from "../services/DurationFormatter"
import { TimestampFormatter } from "../services/TimestampFormatter"
import { StopwatchUI } from "../ui/StopwatchUI"

export class StopwatchApp {
  private stopwatch: Stopwatch
  private timeFormatter: TimeFormatter
  private durationFormatter: DurationFormatter
  private timestampFormatter: TimestampFormatter
  private ui: StopwatchUI

  constructor() {
    this.stopwatch = new Stopwatch()
    this.timeFormatter = new TimeFormatter()
    this.durationFormatter = new DurationFormatter()
    this.timestampFormatter = new TimestampFormatter()
    this.ui = new StopwatchUI()
  }

  public init(): void {
    this.ui.render()
    this.setupEventHandlers()
    this.startUpdateLoop()
    this.updateAllDisplays()
  }

  private setupEventHandlers(): void {
    this.ui.onStart(() => {
      this.stopwatch.start()
    })

    this.ui.onStop(() => {
      this.stopwatch.stop()
    })

    this.ui.onReset(() => {
      this.stopwatch.reset()
      this.updateAllDisplays()
    })
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

    // Main timer display
    const formattedTime = this.timeFormatter.format(elapsed)
    this.ui.updateDisplay(formattedTime)

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
