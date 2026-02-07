export type MenuItemInterface = {
  id: number;
  text: string;
  path: string;
  icon?: React.ReactNode;
  children?: MenuItemInterface[];
};
