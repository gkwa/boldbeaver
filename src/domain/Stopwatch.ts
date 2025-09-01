export class Stopwatch {
  private startTime: number = 0
  private elapsedTime: number = 0
  private isRunning: boolean = false
  private sessionStartTime: Date | null = null

  public start(): void {
    if (this.isRunning) return

    this.startTime = performance.now()
    this.isRunning = true

    // Capture the wall-clock start time
    if (this.sessionStartTime === null) {
      this.sessionStartTime = new Date()
    }
  }

  public stop(): void {
    if (!this.isRunning) return

    this.elapsedTime += performance.now() - this.startTime
    this.isRunning = false
  }

  public reset(): void {
    this.startTime = 0
    this.elapsedTime = 0
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
