import { BaseCase } from "@models/base-case";
import { INavigatedItem } from "./inavigated-item";

export interface OpenedInfoContract extends INavigatedItem {
  model: BaseCase<never, never>;
}
