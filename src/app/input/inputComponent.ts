import { h , Component } from "preact";
import style from "./style.css";
import { noop, debounce } from "../const";
import currencyStyle from "../currency/style.css";

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export type InputProps = {
  isFrom: boolean
  currency: string
  maxVal?: number
  setAmount?: (val: number) => void,
  setValid?: (val: boolean) => void
  amount?: number
  isFocused?: boolean
  selectCurrency?: (name: string) => void
};
const notNumbers = /[^\d\.\,]+/i
export class inputComponent extends Component<InputProps> {
  cursorPosition: number = 0;
  focused: boolean = false;
  input: HTMLDivElement | null = null;

  constructor(props: InputProps) {
    super(props);
  }
  restorePos(rawPosition: number = 0) {
    const position = rawPosition || this.cursorPosition ;
    const inputElem = this.input;
    const sel = window.getSelection();
    if (!(sel && inputElem && this.focused && position)) {
      return;
    }
    const range = document.createRange();
    try {
      range.setStart(
        inputElem.childNodes[0] || inputElem,
        Math.min(position, inputElem.innerText.length)
      );
    } catch (e) { }
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  validate = debounce((
      val: string,
      inputElem: HTMLDivElement,
      setValid: (val: boolean) => void,
      setAmount: (val: number) => void,
    ) => {
      let floatVal = parseFloat(val);
      floatVal = Math.min(floatVal || 0, this.props.maxVal!)
      floatVal = Math.round(floatVal * 100) / 100;
      const sel = window.getSelection();
      if (!sel) {
        return;
      }
      this.cursorPosition = sel.getRangeAt(0).startOffset;
      inputElem.innerHTML = (floatVal || '').toString();
      this.restorePos();
      const inputLength = inputElem.innerHTML.toString().length;
      setAmount(floatVal);
      if (!inputLength) {
        return;
      }
      setValid(true);
    }, 700)
  onInput = (
    setAmount: (val: number) => void,
    setValid: (val: boolean) => void,
    e: Event
  ) => {
    setValid(false);
    const inputElem = e.target as HTMLInputElement;
    let val = inputElem.innerHTML.replace(notNumbers, '');
    val = val.replace(',', '.');
    const sel = window.getSelection();
    if (!sel) {
      return;
    }
    try {
      this.cursorPosition = sel.getRangeAt(0).startOffset;
    } catch (e) {
      this.cursorPosition = 0;
    }
    inputElem.innerHTML = (val || '').toString();
    this.restorePos();
    this.validate(val, inputElem, setValid, setAmount);
  }

  componentDidMount() {
    const input = this.input!;
    if (this.focused != this.props.isFocused && this.props.isFrom) {
      input.focus();
      const sliderEl = document.querySelector(`.${currencyStyle['slider']}`);
      if (sliderEl && iOS) {
        sliderEl.addEventListener('click', function call() {
          input.focus();
          sliderEl.removeEventListener('click', call);
        });
      }
    }
  }
  shouldComponentUpdate(newProps: InputProps) {
    return this.props.isFocused != newProps.isFocused ||
      this.props.amount != newProps.amount;
  }

  componentDidUpdate() {
    if (this.props.isFocused && this.props.isFrom) {
      this.restorePos();
      this.input!.focus();
    }
  }
  render({
    selectCurrency,
    isFrom,
    setAmount,
    setValid,
    amount,
    currency
  }: InputProps) {
    let formatedAmount = (amount || 0);
    let stringAmount;
    if (!formatedAmount) {
      stringAmount = '';
    }  else {
      stringAmount = isFrom ? 
        formatedAmount.toString() : 
        formatedAmount.toFixed(2)
    }
    return h("div", {
      ["contenteditable"]: isFrom,
      ['inputmode']: 'decimal',
      id: `i${isFrom? 'F' : 'T'}${currency}`,
      className: [
        style[!isFrom ? "input" : "input_to"],
        stringAmount ? style["hasVal"] : ''
      ].join(' '),
      ref: (input: any) => this.input = input,
      ['onInput']: isFrom ? this.onInput.bind(
        this,
        setAmount!,
        setValid!
      ) : noop,
      ['onBlur']: () => {
        this.focused = false;
      },
      ['onfocus']: () => {
        this.focused = true;
        if (!this.props.isFocused) {
          selectCurrency!(currency)
        }
      },
      innerHTML: stringAmount
    });
  }
}