import { h, Component } from "preact";
import style  from "./style.css";
import { pocketContanier } from "../pocket/pocketContainer";
import { currenciesNames } from "../const";
import { rateContanier } from "../rate/rateContanier";
import { inputContanier } from "../input/inputContanier";
import { dotsContanier } from "../dots/dotsContanier";

export type CurrencyProps = {
  isFrom: boolean;
  currencies: {
    name: string;
    sigin: string;
  }[];
  from?: string;
  to?: string;
  rates?: Record<string, Record<string, number>>;
  selectFrom?: (name: string) => void,
  selectTo?: (name: string) => void,
};
type SliderState = {
  elem?: HTMLElement
  drag: boolean
  delta: number
  leftPosition: number
}
export class currencyComponent extends Component<CurrencyProps, SliderState> {
  dispach: (name: string) => void
  currencyIndex: number
  slider: HTMLDivElement | null = null;
  
  constructor(props: CurrencyProps) {
    super(props);
    this.state = {
      delta: 0,
      drag: false,
      leftPosition: 0
    };
    this.dispach = this.props.isFrom ?
      props.selectFrom! :
      props.selectTo!
    this.currencyIndex = this.getCurruncyIndex(this.props);
  }
  getCurruncyIndex(props: CurrencyProps) {
    return currenciesNames.indexOf(props.isFrom ?
      props.from! :
      props.to!
    )
  }
  setElemToIndex(index: number) {
    if (!this.state.elem) {
      return;
    }
    const position = index * this.state.elem.clientWidth;
    this.state.elem.style['transform'] = `translate(-${position}px, 0)`
  }
  componentDidMount() {
    if (!(this.props.from && this.state.elem)) {
      return;
    }
    this.setElemToIndex(this.currencyIndex)
  }
  shouldComponentUpdate(nextProps: CurrencyProps) {
    return !this.state.drag && 
    (this.currencyIndex !== this.getCurruncyIndex(nextProps)
      || this.props.rates !== nextProps.rates 
      || this.props.from !== nextProps.from)
  }
  componentWillUpdate(nextProps: CurrencyProps, nextState: SliderState) {
    if (!(this.state && this.state.elem)) {
      return;
    }
    const newIndex = this.getCurruncyIndex(nextProps);
    this.setElemToIndex(newIndex);
    this.currencyIndex = newIndex
  }
  onTouchStart(e: TouchEvent) {
    if (!e.target) {
      return;
    }
    const { clientX } = e.touches[0];
    this.state.elem!.classList.add(style["currency__drag"]);
    this.setState({
      delta: clientX,
      drag: true,
      leftPosition: clientX
    });
  };
  onTouchMove(e: TouchEvent) {
    if (!e.target) {
      return;
    }
    const { clientX } = e.touches[0];
    
    if(this.state.elem) {
      const previous = this.state.elem.style['transform'].match(/\d+/);
      if (previous) {
        this.state.elem!.style['transform'] = `translate(${
          -1 * (parseInt(previous[0]) + (this.state.leftPosition -  clientX))
        }px, 0)`;
      }
    }
    this.setState({
      leftPosition: clientX
    });
  }
  onTouchEnd(e: TouchEvent) {
    if (!e.target) {
      return;
    }
    const { clientX } = e.changedTouches[0];
    const delta = this.state.delta - clientX;
    const absDelta = Math.abs(delta);
    this.state.elem!.classList.remove(style["currency__drag"]);
    const newIndex = this.currencyIndex + (delta / absDelta)
    const index = currenciesNames[Math.max(0, newIndex)];

    this.setState({
      drag: false
    }, () => {
      if (absDelta > 100 && newIndex < currenciesNames.length) {
        this.dispach(index);
      } else {
        this.setElemToIndex(this.currencyIndex);
      }

    })
  }
  render({
    isFrom,
    currencies, 
    rates,
  }: CurrencyProps, 
  state: SliderState
  ) {
    const isRateReady = Object.keys(rates || {}).length;
    return h('div', {
      ref: (input: any) => this.slider = input,
      ['onScroll']: (e: any) => {
        const { target } = e 
        target.scrollLeft = 0;
      },
      className: [
        style['slider'],
        !isFrom ? style["currency__to"] : "",
      ].join(" "),
    },
      [
        h("ul",
        {
          className: [
            style["currency"],
          ].join(" "),
          ["onTouchStart"]: this.onTouchStart.bind(this),
          ["onTouchMove"]: this.onTouchMove.bind(this),
          ["onTouchEnd"]: this.onTouchEnd.bind(this),
          ref: (refElem: any) => { state.elem = refElem }
        },
        currencies.map(currency => {
          return h(
            "li",
            {
              className: style["currency__item"]
            },
            [
              h(
                "div",
                {
                  className: style["currency__name"],
                  id: `n${isFrom ? "F" : "T"}${currency.name}`
                },
                currency.name
              ),
              isRateReady ? inputContanier({
                isFrom,
                currency: currency.name
              }) : null,
              pocketContanier(currency),
              !isFrom &&
              isRateReady ? rateContanier({
                formSigin: currency.sigin,
                isFrom: false,
                fromName: currency.name,
              }) : null
            ]
          );
        })
        ),
        dotsContanier({
          isFrom
        }),
    ]);
  }
};
