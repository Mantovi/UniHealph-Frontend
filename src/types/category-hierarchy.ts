export type CategoryLinkMode =
  | 'specialty-sub'
  | 'sub-category'
  | 'category-type'
  | 'type-product';

export interface LinkModeOption {
  key: CategoryLinkMode;
  label: string;
  superiorLabel: string;
  inferiorLabel: string;
}