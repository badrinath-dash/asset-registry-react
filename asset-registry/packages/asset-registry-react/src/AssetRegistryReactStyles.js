import styled from 'styled-components';
import { variables, mixins } from '@splunk/themes';

const StyledContainer = styled.div`
    ${mixins.reset('inline-block')};
    font-size: ${variables.fontSizeLarge};
    line-height: 200%;
    margin: ${variables.spacing} ${variables.spacingHalf};
    padding: ${variables.spacing} calc(${variables.spacing} * 2);
    border-radius: ${variables.borderRadius};
    box-shadow: ${variables.overlayShadow};
    background-color: ${variables.backgroundColor};
`;

const StyledGreeting = styled.div`
    font-weight: bold;
    color: ${variables.brandColor};
    font-size: ${variables.fontSizeXXLarge};
`;

const FormArea = styled.div `
background-color: #fff;
box-shadow: 0px 5px 10px rgba(90, 116, 148, 0.3);
padding: 40px;
border-radius: 6px;
display: flex;
align-items: center;
justify-content: center;
`;


export { StyledContainer, StyledGreeting, FormArea };
