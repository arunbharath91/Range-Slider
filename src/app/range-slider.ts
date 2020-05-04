interface IOptions {
  min?: number;
  max?: number;
  tooltip?: boolean;
  step?: number;
  value?: number[];
  onChange?:Function
}

const defaultOptions:IOptions = {
  min: 0,
  max: 100,
  tooltip: true,
  step: 0,
  value: [0, 100]
}
 class RangeSlider extends HTMLElement {
  private options!: IOptions;
  private inputLeft!:HTMLElement;
  private inputRight!:HTMLElement;

  private thumbLeft!:HTMLElement;
  private thumbRight!:HTMLElement;
  private range!:HTMLElement;
  private tooltips!: NodeListOf<Element>;
  constructor() {
    super();
    this.config();
  }

  config() {
    const getAllAttr:any = {};
    Array.from(this.attributes).forEach((item) => {
      if(/\S/.test(item.value)) {
        getAllAttr[item.name] = (item.name !== 'onchange') ? eval(item.value) : item.value;
      }
    });
    this.options = {...defaultOptions, ...getAllAttr};
    this.setDefaultAttr();
  }

  setDefaultAttr(){
    this.setAttribute('min', (this.options.min as any).toString());
    this.setAttribute('max', (this.options.max as any).toString());
    this.setAttribute('value', `[${this.options.value}]`);
    this.projectTemplate();
  }

  projectTemplate() {
  const inputs = `
  <range-input>
  <input type="range" class="handleBarRef1" name="points1" min="${this.options.min}" max="${this.options.max}" value="${(this.options.value as any)[0]}" />
  <input type="range" class="handleBarRef2" name="points2" min="${this.options.min}" max="${this.options.max}" value="${(this.options.value as any)[1]}" />
  </range-input>
  <range-slider>
  <range-track></range-track>
  <range-progress></range-progress>
  <range-handle class="left">
  ${(this.options.tooltip) ? '<range-tooltip></range-tooltip>' : ''}
  </range-handle>
  <range-handle class="right">
  ${(this.options.tooltip) ? '<range-tooltip></range-tooltip>' : ''}
  </range-handle>
  </range-slider>
  `;
  this.insertAdjacentHTML('beforeend', inputs);
  if(this.options.step) {
  (this.querySelector('range-track') as HTMLElement).style.cssText = `
  background-size: ${this.options.step}% 2px;
  background-position: center;
  background-image: repeating-linear-gradient(to right, rgb(98, 0, 238), rgb(202, 172, 244) 2px, transparent 0, transparent);`
  }
  this.initRange();
  }

  initRange() {
  this.inputLeft = (this.querySelector('.handleBarRef1') as HTMLElement);
  this.inputRight = (this.querySelector('.handleBarRef2') as HTMLElement);

  this.thumbLeft = (this.querySelector('range-slider > range-handle.left') as HTMLElement);
  this.thumbRight = (this.querySelector('range-slider > range-handle.right') as HTMLElement);
  this.range = (this.querySelector('range-slider > range-progress') as HTMLElement);
  this.tooltips = this.querySelectorAll('range-tooltip');

  this.inputLeft.addEventListener('input', (e) => this.setLeftValue(e.target));
  this.setLeftValue(this.inputLeft);

  this.inputRight.addEventListener('input', (e) => this.setRightValue(e.target));
  this.setRightValue(this.inputRight);

  this.inputLeft.addEventListener('change', () => {
    this.setAttribute('value', `[${this.options.value}]`)
    if(this.options.onChange) this.options.onChange.call(this);
  });
  this.inputRight.addEventListener('change', () => {
    this.setAttribute('value', `[${this.options.value}]`)
    if(this.options.onChange) this.options.onChange.call(this);
  });
  }

  setLeftValue(elem: any) {
  let min = parseInt(elem.min);
  let max = parseInt(elem.max);
  let rightValue = Number(this.inputRight.getAttribute('value'));
  elem.setAttribute('value', elem.value);
  elem.value = Math.min(elem.value, rightValue-1);

  let percent = ((elem.value - min)/(max-min)) * 100;

  this.thumbLeft.style.left = `${percent}%`;
  this.range.style.left = `${percent}%`;
  this.tooltips[0].innerHTML = this.shortNumber(elem.value);
  this.options.value = [Number(elem.value), rightValue];
  }

  setRightValue(elem: any) {
  let min = parseInt(elem.min);
  let max = parseInt(elem.max);
  let leftValue = Number(this.inputLeft.getAttribute('value'));
  elem.setAttribute('value', elem.value);
  elem.value = Math.max(elem.value, leftValue+1);


  let percent = ((elem.value - min)/(max-min)) * 100;

  this.thumbRight.style.right = `${100-percent}%`;
  this.range.style.right = `${100-percent}%`;
  this.tooltips[1].innerHTML = this.shortNumber(elem.value);
  this.options.value = [leftValue, Number(elem.value)];
  }


  shortNumber(num: number) {
    let abs = Math.abs(num);
    const rounder = Math.pow(10, 1);
    let key = '';

    const powers = [
      { key: 'Q', value: Math.pow(10, 15) },
      { key: 'T', value: Math.pow(10, 12) },
      { key: 'B', value: Math.pow(10, 9) },
      { key: 'M', value: Math.pow(10, 6) },
      { key: 'K', value: 1000 }
    ];

    for (const power of powers) {
      let reduced = abs / power.value;
      reduced = Math.round(reduced * rounder) / rounder;
      if (reduced >= 1) {
        abs = reduced;
        key = power.key;
        break;
      }
    }
    return abs + key;
  }

}


window.customElements.define("app-range", RangeSlider);
