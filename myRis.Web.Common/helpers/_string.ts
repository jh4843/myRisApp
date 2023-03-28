declare global {
  interface String {
    fillPadStart(width: number, pad: string): string | String;
  }

  interface Number {
    fillPadStart(width: number, pad: number): string | String;
  }
}

String.prototype.fillPadStart = function (width, pad) {
  return this.length >= width
    ? this
    : new Array(width - this.length + 1).join(pad) + this;
};

Number.prototype.fillPadStart = function (width, pad) {
  let str = String(this); //문자열 변환
  return str.length >= width
    ? str
    : new Array(width - str.length + 1).join(pad.toString()) + str; //남는 길이만큼 0으로 채움
};

export {};
