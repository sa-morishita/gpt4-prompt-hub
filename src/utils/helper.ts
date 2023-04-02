export const filterClassNames = (...classes: string[]): string => {
  return classes.filter(Boolean).join(" ");
};

export const judgeSelected = (route: string, href: string) => {
  return route === "/" ? route === href : route.includes(href) && href !== "/";
};
