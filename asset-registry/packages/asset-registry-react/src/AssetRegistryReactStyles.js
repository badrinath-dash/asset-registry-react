import styled from 'styled-components';
import { variables, mixins } from '@splunk/themes';

const StyledContainer = styled.div `
    ${mixins.reset('inline-block')};
    font-size: ${variables.fontSizeLarge};
    line-height: 200%;
    margin: ${variables.spacing} ${variables.spacingHalf};
    padding: ${variables.spacing} calc(${variables.spacing} * 2);
    border-radius: ${variables.borderRadius};
    box-shadow: ${variables.overlayShadow};
    background-color: ${variables.backgroundColor};
`;

const StyledGreeting = styled.div `
    font-weight: bold;
    color: ${variables.brandColor};
    font-size: ${variables.fontSizeXXLarge};
`;

const NotificationBox = styled.div `
background-color: #faebd7;
`;

const item = styled.div `container {
        display: flex;
        justify - content: center;
        flex - wrap: wrap;
        gap: 2e m;
    }`;

const card = styled.div `
text - align: center;
padding: 10 px;
width: 300 px;
border - radius: 5 px;
padding: 1e m;
box - shadow: rgba(99, 99, 99, 0.2) 0 px 2 px 8 px 0 px;
}`


export { StyledContainer, StyledGreeting, NotificationBox, item, card };