import React from 'react';

import layout from '@splunk/react-page';
import HomeDashboardReact from '@splunk/asset-registry-react/HomeDashboardReact';
import { SplunkThemeProvider } from '@splunk/themes';
import { DashboardContextProvider } from '@splunk/dashboard-context';
import EnterpriseViewOnlyPreset from '@splunk/dashboard-presets/EnterpriseViewOnlyPreset';
import getTheme from '@splunk/themes/getTheme';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';
import { StyledContainer, StyledGreeting } from './StartStyles';

const baseTheme = getTheme({family: 'prisma', colorScheme: 'dark', density: 'compact' });
console.log(baseTheme.family, baseTheme.focusColor);

const themeToVariant = {
    enterprise: { colorScheme: 'light', family: 'enterprise' },
    enterpriseDark: { colorScheme: 'dark', family: 'enterprise' },
    prisma: { colorScheme: 'dark', family: 'prisma',backgroundColorPage: '#111215',backgroundColorScrim:'#0b0c0e'  }
};

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');


layout(
    <SplunkThemeProvider family="prisma" colorScheme="light"  density="comfortable">
        <StyledContainer>

            <StyledGreeting>Splunk Data Catalog Home</StyledGreeting>
            <HomeDashboardReact name="from inside HomeDashboardReact" />
        </StyledContainer>
</SplunkThemeProvider>
);


