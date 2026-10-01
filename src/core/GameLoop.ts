export type UpdateCallback = (dt: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
  private running = false;
  private lastTime = 0;
  private rafId = 0;
  onUpdate: UpdateCallback = () => {};
  onRender: RenderCallback = () => {};

  start(): void {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    const tick = (now: number): void => {
      if (!this.running) return;
      const rawDt = (now - this.lastTime) / 1000;
      this.lastTime = now;
      const dt = Math.min(0.05, rawDt);
      this.onUpdate(dt);
      this.onRender();
      this.rafId = requestAnimationFrame(tick);
    };
    this.rafId = requestAnimationFrame(tick);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }
}
