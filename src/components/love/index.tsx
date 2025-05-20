import { FC, useEffect, useRef } from 'react'
import s from './index.module.less'
import Point from './point'
import ParticlePool from './particlePool'
import settings from './settings'

const Love:FC = () => {
  const pinkboard = useRef(null)

  const init = (canvas:HTMLCanvasElement) => {
    // const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d');
    const particles = new ParticlePool(settings.particles.length);
    const particleRate = settings.particles.length / settings.particles.duration; // particles/sec

    let time:number;

    // get point on heart with -PI <= t <= PI
    function pointOnHeart(t:number) {
      return new Point(
        160 * Math.pow(Math.sin(t), 3),
        130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
      );
    }

    // creating the particle image using a dummy canvas
    const image = (function() {
      const canvas  = document.createElement('canvas'),
          context = canvas.getContext('2d');
      canvas.width  = settings.particles.size;
      canvas.height = settings.particles.size;
      // helper function to create the path
      function to(t:number) {
        const point = pointOnHeart(t);
        point.x = settings.particles.size / 2 + point.x * settings.particles.size / 350;
        point.y = settings.particles.size / 2 - point.y * settings.particles.size / 350;
        return point;
      }
      if(!context) return
      // create the path
      context.beginPath();
      let t = -Math.PI;
      let point = to(t);
      context.moveTo(point.x, point.y);
      while (t < Math.PI) {
        t += 0.01; // baby steps!
        point = to(t);
        context.lineTo(point.x, point.y);
      }
      context.closePath();
      // create the fill
      context.fillStyle = '#0084ff';
      context.fill();
      // create the image
      const image = new Image();
      image.src = canvas.toDataURL();
      return image;
    })();

    // render that thing!
    function render() {
      // next animation frame
      requestAnimationFrame(render);
      
      // update time
      const newTime   = new Date().getTime() / 1000,
          deltaTime = newTime - (time || newTime);
      time = newTime;
      if(!context) return
      // clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // create new particles
      const amount = particleRate * deltaTime;
      for (let i = 0; i < amount; i++) {
        const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
        const dir = pos.clone().length(settings.particles.velocity) as Point
        particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
      }
      
      // update and draw particles
      particles.update(deltaTime);
      particles.draw(context, image);
    }

    // handle (re-)sizing of the canvas
    function onResize() {
      canvas.width  = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    window.onresize = onResize;

    // delay rendering bootstrap
    setTimeout(function() {
      onResize();
      render();
    }, 10);
  }

  useEffect(() => {
    if(pinkboard) {
      const canvas = document.getElementById('pinkboard');
      init(canvas as HTMLCanvasElement)
    }
  }, [pinkboard])


  return (
    <div className={s['love-wrapper']}>
      <canvas ref={pinkboard} id="pinkboard" className={s.pinkboard}></canvas>
      {/* <div className={s.name}>名字</div> */}
    </div>
  )
}

export default Love