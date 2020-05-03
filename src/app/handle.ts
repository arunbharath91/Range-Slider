export class Handle {
  private slider: any;
  private position: number;
  private index: number;
  private handle!: HTMLElement;
  private tooltip!: HTMLElement;
  private minLimit: number;
  private maxLimit: number;
  constructor(slider: any, position: number, index: number) {
    this.slider = slider;
    this.position = position;
    this.index = index;
    this.minLimit = 0;
    this.maxLimit = this.slider.options.width;
    this.projectHandle();
  }

  projectHandle() {
    this.handle = document.createElement("range-handle");
    const position = ((this.position - this.slider.options.min) * this.slider.pixelsPerUnit);
    this.handle.style.left = `${position}px`;
    this.slider.appendChild(this.handle);
    this.setTrack(position);

    this.handle.addEventListener("mousedown", (e: any) => this.onMouseDown(e));
    this.projectTooltip();
  }

  setTrack(position: number) {
    if(this.index === 0) {
      this.slider.querySelector('range-track').style.left = `${position}px`;
    } else {
      this.slider.querySelector('range-track').style.right = `${this.slider.options.width - position}px`;
    }
  }

  projectTooltip() {
    if (this.slider.options.tooltip) {
      this.tooltip = document.createElement("range-tooltip");
      this.tooltip.innerHTML = (this.position - this.slider.options.min).toString();
      this.handle.appendChild(this.tooltip);
    }
  }

  onMouseDown(e: any) {

    e = e || window.event;
    e.preventDefault();
    document.onmousemove = (e) => this.onMouseMove(e);
    document.onmouseup = (e) => this.onMouseUp(e);

    // find left side handle and set minimum limit
    if (this.index > 0) {
      this.minLimit = parseInt(this.slider.handleDOMs[this.index - 1].handle.style.left);
    } else {
      this.minLimit = 0;
    }

    // find right side handle and set maximum limit
    if (this.index < this.slider.handleDOMs.length - 1) {
      this.maxLimit = parseInt(this.slider.handleDOMs[this.index + 1].handle.style.left);
    } else {
      this.maxLimit = Number(this.slider.options.width);
    }

  }

  onMouseMove(e: any) {
    e = e || window.event;
    e.preventDefault();

    this.moveHandle(e);
  }

  onMouseUp(e: any) {
    this.moveHandle(e)
    document.onmousemove = null;
    document.onmouseup = null;
    if(this.slider.options.update) {
      this.slider.onChange();
    }
  }

  moveHandle(e: any) {

    let currentPos = parseInt(this.handle.style.left);
    if (currentPos < this.minLimit) {
      this.handle.style.left = `${this.minLimit}px`;
    } else if (currentPos > this.maxLimit) {
      this.handle.style.left = `${this.maxLimit}px`;
    } else {
      this.handle.style.left = `${e.movementX + currentPos}px`;
      this.setTrack(currentPos);
    }

    this.writeTooltipValue();
  }

  writeTooltipValue() {
    if (this.slider.options.tooltip) {
      let value = Math.floor(parseInt(this.handle.style.left) / this.slider.pixelsPerUnit);



      if (value < 0) {
        value = 0;
      }

      if (value > this.slider.options.max) {
        value = this.slider.options.max;
      }

      this.tooltip.innerHTML = value.toString();
      (this.index === 0) ? this.slider.setAttribute('value', `[${value},${this.slider.handleDOMs[1].tooltip.innerText}]`) : this.slider.setAttribute('value', `[${this.slider.handleDOMs[0].tooltip.innerText},${value}]`)
    }
  }

}
