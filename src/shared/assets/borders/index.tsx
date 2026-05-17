// @/shared/assets/borders/index.ts

import { withBorderStyles, type BorderComponent } from "@/shared/utils/withBorderStyles";

const modules = import.meta.glob<{ default: BorderComponent }>('./*.tsx', { eager: true });

const bordersMap = new Map<string, BorderComponent>();

Object.entries(modules).forEach(([path, module]) => {
  const name = path.replace(/^\.\/|\.tsx$|\.ts$/g, '');
  if (module.default) {
    bordersMap.set(name, withBorderStyles(module.default));
  }
});

export const Borders = new Proxy({} as Record<string, BorderComponent>, {
  get(_, prop: string) {
    return bordersMap.get(prop) || null;
  },
});

export default Borders;