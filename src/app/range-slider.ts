import { Handle } from "./handle";

interface IOptions {
min: number;
max: number;
value: number[];
width: number;
tooltip?: boolean;
step?: number;
update?:Function
}

const defaultOptions:IOptions = {
  min:0,
  max:100,
  value: [0, 100],
  width: 150,
  tooltip: true,
  step: 10
}

 export class RangeSlider extends HTMLElement {
 private options!: IOptions;
 private pixelsPerUnit!: number;
 private handleDOMs: Handle[] = [];
    constructor() {
        super();
        this.config();
    }

    config() {
      const getAllAttr:any = {};
      Array.from(this.attributes).forEach((item) => {
        if(/\S/.test(item.value)) {
          getAllAttr[item.name] = (item.name !== 'update') ? eval(item.value) : item.value;
        }
      });

      this.options = {...defaultOptions, ...getAllAttr};
      this.pixelsPerUnit = this.options.width / (this.options.max - this.options.min);
      this.style.width = `${this.options.width}px`;
      this.classList.add("range-slider");
      this.projectTemplate();
    }

    projectTemplate() {
        // Creating seekbar
        const seekbar = document.createElement("range-seekbar");
        this.appendChild(seekbar);

        const track = document.createElement("range-track");
        this.appendChild(track);

        const step = document.createElement("range-step");
        this.appendChild(step);

        if(this.options.step) {
        step.style.cssText = `
        background-size: ${this.options.step}% 2px;
        background-position: center;
        background-image: repeating-linear-gradient(to right, rgb(228, 209, 255), rgb(202, 172, 244) 2px, transparent 0px, transparent);`
        }

        // Creating handles
        for(let i=0; i < this.options.value.length; i++){
            let position = this.options.value[i];
            let handle = new Handle(this, position, i);
            this.handleDOMs.push(handle);
        }

    }

    onChange() {
      if(this.options.update) {
        let fn = this.options.update;
        eval(fn.toString())
      }
    }
 }

window.customElements.define("app-range", RangeSlider);
