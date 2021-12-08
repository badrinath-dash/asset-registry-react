import React from 'react';

import layout from '@splunk/react-page';
import HomeDashboardReact from '@splunk/asset-registry-react';
import { SplunkThemeProvider } from '@splunk/themes';
import { DashboardContextProvider } from '@splunk/dashboard-context';
import EnterpriseViewOnlyPreset from '@splunk/dashboard-presets/EnterpriseViewOnlyPreset';

import { defaultTheme, getThemeOptions } from '@splunk/splunk-utils/themes';

import { StyledContainer, StyledGreeting } from './StartStyles';

const themeProviderSettings = getThemeOptions(defaultTheme() || 'enterprise');


layout(
    <SplunkThemeProvider {...themeProviderSettings}>
        <StyledContainer>
            <StyledGreeting>Splunk AssetRegistry</StyledGreeting>
            <HomeDashboardReact name="from inside HomeDashboardReact" />
        </StyledContainer>
    </SplunkThemeProvider>
);


