import React, { useState, useEffect } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Message from '@splunk/react-ui/Message';
import Pencil from '@splunk/react-icons/Pencil';
import Button from '@splunk/react-ui/Button';
import Card from '@splunk/react-ui/Card';
import CardLayout from '@splunk/react-ui/CardLayout';
import Menu from '@splunk/react-ui/Menu';
import Refresh from '@splunk/react-icons/Refresh';
import Clone from '@splunk/react-icons/Clone';
import Remove from '@splunk/react-icons/Remove';
import Search from '@splunk/react-icons/Search';
import { pick } from '@splunk/themes';
import Text from '@splunk/react-ui/Text';
import HamburgerMenu from '@splunk/react-icons/HamburgerMenu';
import styled, { css } from 'styled-components';
import { includes, without } from 'lodash';
import { searchKVStore } from './ManageKVStore';



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


const HomeDashboardReact = () => {
    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [assetValues, setAssetValues] = useState([]);
    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };

    useEffect(() => {
        const defaultErrorMsg = 'There is some error in data retrival, please try again';
        searchKVStore('asset_registry_collection', '', '', defaultErrorMsg)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data);
                        setAssetValues(data);
                    });
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'Data Retrival from KVStore',
                    });
                } else {
                    //setAssetValues(response.json);
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'No entry exist for this index',
                    });
                }
            })
            .catch((defaultErrorMsg) => {
                setInfoMessage({
                    visible: true,
                    type: 'error',
                    message: defaultErrorMsg,
                });
            });
    }, []);

    const handleChange = (e, { value: clickValue }) => {
        const prevValues = assetValues;
        if (includes(prevValues, clickValue)) {
            setAssetValues(without(prevValues, clickValue));
        } else {
            setAssetValues(prevValues.concat(clickValue));
        }
    };
    const actionPrimary = <Button appearance="secondary" icon={<Pencil hideDefaultTooltip />} />;

    const actionsSecondaryMenuOne = (
        <Menu>
            <Menu.Item icon={<Refresh />}>Refresh</Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<Clone />}>Duplicate</Menu.Item>
            <Menu.Item icon={<Remove />}>Delete</Menu.Item>
        </Menu>
    );

    const actionsSecondaryMenuTwo = (
        <Menu>
            <Menu.Item>Favorite</Menu.Item>
            <Menu.Item>Share</Menu.Item>
        </Menu>
    );

    const selectedValues = assetValues;

    const Cards = assetValues.map((assetValue) => (

        <Card key={assetValue._key}>
                <Card.Header
                    title={assetValue.index_name}
                    subtitle={assetValue.index_size_mb}
                    actionPrimary={actionPrimary}
                    actionsSecondary={actionsSecondaryMenuOne}
                />

                <Card.Body>
                   {assetValue.index_description}
                </Card.Body>
                <Card.Footer>
                    <Button appearance="primary">Select</Button>
                </Card.Footer>
            </Card>

    ));

    return (
        <div>
            {infoMessage.visible && (
                <Message
                    style={{ background: '#c3cbd4' }}
                    appearance="fill"
                    type={infoMessage.type || 'info'}
                    onRequestRemove={handleMessageRemove}
                >
                    {infoMessage.message}
                </Message>
            )}
            <Text
            defaultValue=""
            endAdornment={
                <>
                    <StyledButton appearance="pill" icon={<Search />} />
                    <span>|</span>
                    <StyledButton appearance="pill"  />
                </>
            }
            inline
            placeholder="Search field"
            startAdornment={<StyledButton appearance="pill" icon={<HamburgerMenu />} />}
            />
            <SplunkThemeProvider family="prisma" colorScheme="light" density="comfortable">
                <div>
                    <CardLayout cardWidth={250} gutterSize={15}  alignCards="left">
                    {Cards}
                    </CardLayout>
                    </div>
            </SplunkThemeProvider>
        </div>
    );
};

export default HomeDashboardReact;
