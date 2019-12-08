import { connect } from "react-redux";
import { pocketComponent, PocketProps } from "./pocketComponent";
import { AppStore } from "@src/index";

const stateToProps = (state: AppStore, props: PocketProps): PocketProps => {
  return {
    ...props,
    val: state.pockets[props.name]
  };
};
export const pocketContanier = connect(stateToProps)(pocketComponent);
