export type ListLinkType = {
  href: string;
  title: string;
  image?: string;
};

export type ListInnerLinkType = ListLinkType & { isInnerLink?: boolean; isHidden?: boolean };

export type H2Type = {
  title: string;
  isSrOnly?: boolean;
  isHidden?: boolean;
};
