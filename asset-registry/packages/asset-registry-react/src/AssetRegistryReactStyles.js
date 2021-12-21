import styled from 'styled-components';
import { variables, mixins, pick } from '@splunk/themes';
import Button from '@splunk/react-ui/Button';
import { css } from 'styled-components';


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


const StyledButton = styled(Button)
`
    ${pick({
        prisma: {
            comfortable: css`
                width: 26px;
                min-width: 26px;
                min-height: 26px;
                margin: 8px;
                padding: 0;
            `,
            compact: css`
                width: 22px;
                min-width: 22px;
                min-height: 22px;
                margin: 8px;
                padding: 0;
            `,
        },
    })}
`;




export { StyledContainer, StyledGreeting, NotificationBox,StyledButton };
