  /*
 * Point class
 */
class Point {
  x:number;
  y:number;
  constructor(x:number, y:number) {
    this.x = (typeof x !== 'undefined') ? x : 0;
    this.y = (typeof y !== 'undefined') ? y : 0;
  }
  clone() {
    return new Point(this.x, this.y);
  };
  length(length:number|undefined) {
    if (typeof length == 'undefined')
      return Math.sqrt(this.x * this.x + this.y * this.y);
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  };
  normalize() {
    const length = this.length(undefined) as number;
    this.x /= length;
    this.y /= length;
    return this;
  };
}

export default Point
