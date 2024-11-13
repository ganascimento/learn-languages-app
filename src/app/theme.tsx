"use client";

import { ThemeProvider } from "@emotion/react";
import theme from "../theme/themeConfig";

export default function ThemeClient({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
