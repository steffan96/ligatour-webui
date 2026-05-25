import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ReactNode } from "react";

type AppThemeProperties = {
	children: ReactNode;
	disableCustomTheme?: boolean;
	themeComponents?: any;
};

export default function AppTheme({
	children,
	disableCustomTheme = false,
	themeComponents = {},
}: AppThemeProperties) {
	const theme = createTheme({
		components: disableCustomTheme ? {} : themeComponents,
		// Add your theme customization here
	});

	return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
