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
import Text from '@splunk/react-ui/Text';
import Plus from '@splunk/react-icons/Plus';
import Paginator from '@splunk/react-ui/Paginator';
import {
    Redirect,
    BrowserRouter as Router,
    Switch,
    useLocation,
    useHistory
  } from "react-router-dom";
import Clickable, { isInternalLink, NavigationProvider } from '@splunk/react-ui/Clickable';
import { includes, without } from 'lodash';
import { searchKVStore } from './ManageKVStore';
import { StyledButton } from './AssetRegistryReactStyles';


const HomeDashboardReact = () => {
    // const history = useHistory();
    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [assetValues, setAssetValues] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);


    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };



    useEffect(() => {
        const defaultErrorMsg = 'There is some error in data retrival, please try again or refresh this page';
        searchKVStore('asset_registry_collection', '', '',defaultErrorMsg)
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
                    setTimeout(() => {
                    setInfoMessage({
                        visible: false,
                    });
                }, 1000);
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


    const actionPrimary = <Button appearance="secondary" icon={<Pencil hideDefaultTooltip />} />;

    const actionsSecondaryMenuOne = (
        <Menu>
            <Menu.Item icon={<Refresh />}>Ability</Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<Clone />}>POW</Menu.Item>

            <Menu.Item icon={<Remove />}>Delete</Menu.Item>
        </Menu>
    );

    function SearchInputChange (event) {
        event.preventDefault();
        console.log(searchTerm);
    }

    function handleCardSelect(event) {
        //event.preventDefault();
        console.log(event);
        // history.push("/view-asset");
        return  <Redirect  to={`/view-asset/_key=${event}`} />
    }

    const handleClick = (e, { openInNewContext, to }) => {
        if (!openInNewContext && isInternalLink(to)) {
            e.preventDefault();
            window.alert(`In NavigationProvider click handler, to: ${to}`); // eslint-disable-line no-alert
        }
    };
    const selectedValues = assetValues;
    const Cards = assetValues.filter((selectedValues) => {
        if (searchTerm === ""){
          return selectedValues;
        }if (selectedValues.index_name.toLowerCase().includes(searchTerm)){
            return selectedValues;
    }
    }).map((assetValue) => (
        <Card key={assetValue._key}>
                <Card.Header
                    title={assetValue.index_name}
                    subtitle={assetValue.index_size_mb}
                    actionsSecondary={actionsSecondaryMenuOne}
                    value={assetValue}
                    selected={includes(selectedValues, assetValue)}
                />
                <Card.Body>
                   {assetValue.index_description}
                </Card.Body>
                <Card.Footer>
                    <NavigationProvider onClick={handleClick}>
                    <Button  to={`view-asset?key=${assetValue._key}`}  openInNewContext>Details</Button>
                    </NavigationProvider>
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
            name="search_input"
            onChange= {(event) => {
                setSearchTerm(event.target.value.toLowerCase())
            }}
            endAdornment={
                <>
                <StyledButton
                 onClick={SearchInputChange}
                 appearance="pill"
                 icon={<Search />} />
                </>
            }
            inline
            placeholder="Enter index name to search"
            />
             <Button icon={<Plus screenReaderText={null} />} label="Add New Asset"  to={`view-asset?key=`}  openInNewContext/>

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
