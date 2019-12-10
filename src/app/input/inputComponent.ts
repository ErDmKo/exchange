import { h, Component } from "preact";
import style from "./style.css";
import { debounce } from "../const";

export type InputProps = {
  isFrom: boolean;
  currency: string;
  maxVal?: number;
  setAmount?: (val: number) => void;
  setValid?: (val: boolean) => void;
  setDirection?: (val: boolean, name: string) => void;
  amount?: number;
  isFocused?: boolean;
};
const notNumbers = /[^\d\.\,]+/i;
export class inputComponent extends Component<InputProps> {
  cursorPosition: number = 0;
  focused: boolean = false;
  input: HTMLDivElement | null = null;

  constructor(props: InputProps) {
    super(props);
  }
  restorePos(rawPosition: number = 0) {
    const position = rawPosition || this.cursorPosition;
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
    } catch (e) {}
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
  validate = debounce(
    (
      val: string,
      inputElem: HTMLDivElement,
      setAmount: (val: number) => void
    ) => {
      let floatVal = parseFloat(val);
      const rawfloatVal = Math.min(floatVal || 0, this.props.maxVal!);
      floatVal = Math.round(rawfloatVal * 100) / 100;
      const sel = window.getSelection();
      if (!sel) {
        return;
      }
      this.cursorPosition = sel.getRangeAt(0).startOffset;
      inputElem.innerHTML = (floatVal || "").toString();
      const inputLength = inputElem.innerText.toString().length;
      this.cursorPosition =
        rawfloatVal == this.props.maxVal ? inputLength : this.cursorPosition;
      this.restorePos();
      setAmount(floatVal);
      if (!inputLength) {
        return;
      }
    },
    1000
  );
  onInput = (
    setAmount: (val: number) => void,
    setValid: (val: boolean) => void,
    e: Event
  ) => {
    setValid(false);
    const inputElem = e.target as HTMLInputElement;
    const rawInput = inputElem.innerText;
    let val = rawInput.replace(notNumbers, "");
    val = val.replace(",", ".");
    const delta = rawInput.length - val.length;
    const sel = window.getSelection();
    if (!sel) {
      return;
    }
    try {
      this.cursorPosition = sel.getRangeAt(0).startOffset - delta;
    } catch (e) {
      this.cursorPosition = 0;
    }
    inputElem.innerHTML = (val || "").toString();
    this.restorePos();
    this.validate(val, inputElem, setAmount);
  };

  componentDidMount() {
    const input = this.input!;
    if (this.focused != this.props.isFocused && this.props.isFrom) {
      input.focus();
    }
  }
  shouldComponentUpdate(newProps: InputProps) {
    return (
      this.props.isFocused != newProps.isFocused ||
      this.props.amount != newProps.amount
    );
  }

  componentDidUpdate() {
    if (this.props.isFocused) {
      this.restorePos();
      this.input!.focus();
    }
  }
  render({
    setDirection,
    isFocused,
    isFrom,
    setAmount,
    setValid,
    amount,
    currency
  }: InputProps) {
    let formatedAmount = amount || 0;
    let stringAmount;
    if (!formatedAmount) {
      stringAmount = "";
    } else {
      stringAmount = isFocused
        ? (Math.round(formatedAmount * 100) / 100).toString()
        : formatedAmount.toFixed(2);
    }
    return h("div", {
      ["contenteditable"]: true,
      ["inputmode"]: "decimal",
      id: `i${isFrom ? "F" : "T"}${currency}`,
      className: [
        style[!isFrom ? "input" : "input_to"],
        stringAmount ? style["hasVal"] : ""
      ].join(" "),
      ref: (input: any) => (this.input = input),
      ["onInput"]: this.onInput.bind(this, setAmount!, setValid!),
      ["onBlur"]: () => {
        this.focused = false;
      },
      ["onfocus"]: () => {
        this.focused = true;
        if (!this.props.isFocused) {
          setDirection!(this.props.isFrom, this.props.currency);
        }
      },
      innerHTML: stringAmount
    });
  }
}
