import settings from './settings'
import Point from './point'
export type PointType = { x: number, y: number }
/*
  * Particle class
  */
class Particle {
  position: PointType;
  velocity: PointType;
  acceleration: PointType;
  age: number;

  constructor() {
    this.position = new Point(0, 0);
    this.velocity = new Point(0, 0);
    this.acceleration = new Point(0, 0);
    this.age = 0;
  }
  initialize(x:number, y:number, dx:number, dy:number) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  };
  update(deltaTime:number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draw(context:any, image:any) {
    function ease(t:number) {
      return (--t) * t * t + 1;
    }
    const size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = 1 - this.age / settings.particles.duration;
    context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
  };
}
export default Particle