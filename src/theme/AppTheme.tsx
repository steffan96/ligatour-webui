import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface AppThemeProps {
  children: ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: any;
}

export default function AppTheme({ 
  children, 
  disableCustomTheme = false, 
  themeComponents = {} 
}: AppThemeProps) {
  
  const theme = createTheme({
    components: disableCustomTheme ? {} : themeComponents,
    // Add your theme customization here
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
