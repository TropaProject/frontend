import type { ComponentPropsWithoutRef } from "react";
import type { Link } from "react-router-dom";

export type LinkPropsOptional = Partial<Pick<ComponentPropsWithoutRef<typeof Link>, 'to'>> &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'to'>
