export class Stopwatch {
  private startTime: number = 0
  private elapsedTime: number = 0
  private isRunning: boolean = false
  private sessionStartTime: Date | null = null
  private initialOffset: number = 0

  constructor(initialOffsetMs: number = 0) {
    this.initialOffset = initialOffsetMs
    this.elapsedTime = initialOffsetMs // Start with the offset already applied
  }

  public start(): void {
    if (this.isRunning) return

    this.startTime = performance.now()
    this.isRunning = true

    // Capture the wall-clock start time
    if (this.sessionStartTime === null) {
      this.sessionStartTime = new Date()
      // If we have an offset, adjust the session start time backwards
      if (this.initialOffset > 0) {
        this.sessionStartTime = new Date(this.sessionStartTime.getTime() - this.initialOffset)
      }
    }
  }

  public stop(): void {
    if (!this.isRunning) return

    this.elapsedTime += performance.now() - this.startTime
    this.isRunning = false
  }

  public reset(): void {
    this.startTime = 0
    this.elapsedTime = this.initialOffset // Reset to initial offset instead of 0
    this.isRunning = false
    this.sessionStartTime = null
  }

  public getElapsed(): number {
    if (this.isRunning) {
      return this.elapsedTime + (performance.now() - this.startTime)
    }
    return this.elapsedTime
  }

  public getIsRunning(): boolean {
    return this.isRunning
  }

  public getSessionStartTime(): Date | null {
    return this.sessionStartTime
  }

  public hasStarted(): boolean {
    return this.sessionStartTime !== null
  }
}
