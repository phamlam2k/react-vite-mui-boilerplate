import type { ReactNode } from "react";

export type MenuItemInterface = {
  id: number;
  text: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItemInterface[];
};

export interface IOptions<TValue> {
  value: TValue;
  label: string | number;
  iconLabel?: ReactNode;
}
