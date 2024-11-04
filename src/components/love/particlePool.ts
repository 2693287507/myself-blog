import settings from "./settings";
import Particle from "./particle";

/*
* ParticlePool class
*/
class ParticlePool {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  particles:any[];
  firstActive = 0;
  firstFree = 0;
  duration = settings.particles.duration;
  
  constructor(length:number) {
    // create and populate particle pool
    this.particles = new Array(length);
    for (let i = 0; i < this.particles.length; i++)
      this.particles[i] = new Particle();
  }
  add(x:number, y:number, dx:number, dy:number) {
    this.particles[this.firstFree].initialize(x, y, dx, dy);
    
    // handle circular queue
    this.firstFree++;
    if (this.firstFree == this.particles.length) this.firstFree = 0;
    if (this.firstActive == this.firstFree) this.firstActive++;
    if (this.firstActive == this.particles.length) this.firstActive = 0;
  };
  update(deltaTime:number) {
    let i;
    // update active particles
    if (this.firstActive < this.firstFree) {
      for (i = this.firstActive; i < this.firstFree; i++)
        this.particles[i].update(deltaTime);
    }
    if (this.firstFree < this.firstActive) {
      for (i = this.firstActive; i < this.particles.length; i++)
        this.particles[i].update(deltaTime);
      for (i = 0; i < this.firstFree; i++)
        this.particles[i].update(deltaTime);
    }
    
    // remove inactive particles
    while (this.particles[this.firstActive].age >= this.duration && this.firstActive != this.firstFree) {
      this.firstActive++;
      if (this.firstActive == this.particles.length) this.firstActive = 0;
    }
    
    
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  draw(context:any, image:any) {
    // draw active particles
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++)
        this.particles[i].draw(context, image);
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++)
        this.particles[i].draw(context, image);
      for (let i = 0; i < this.firstFree; i++)
        this.particles[i].draw(context, image);
    }
  };
}
export default ParticlePool;