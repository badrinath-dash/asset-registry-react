import React, { useState, useEffect } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Message from '@splunk/react-ui/Message';
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
import Select from '@splunk/react-ui/Select';
import Paginator from '@splunk/react-ui/Paginator';
import { isInternalLink, NavigationProvider } from '@splunk/react-ui/Clickable';
//import ControlGroup from '@splunk/react-ui/ControlGroup';
import { includes, without } from 'lodash';

// Custom Imports inside this react App
import { searchKVStore } from './ManageKVStore';
import { StyledButton } from './AssetRegistryReactStyles';
import { SortByOptions } from './DropDownData';


const HomeDashboardReact = () => {
    // const history = useHistory();
    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [assetValues, setAssetValues] = useState([]);
    const [searchTerm, setSearchTerm] = useState([]);
    const [sortType, setSortType] = useState('index_name');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);

    // Function to handle Pagination
    const handlePaginatorChange = (event, { page }) => {
        setCurrentPage(page);
    };

    // Function to remove the Error / Success Message on the screen
    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };

    useEffect(() => {
        const defaultErrorMsg =
            'There is some error in data retrival from SPLUNK KVStore, please try again or refresh this page';
        searchKVStore('asset_registry_collection', '', '', defaultErrorMsg)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        // console.log(data); Print the data from KVStore
                        setAssetValues(data);
                    });
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'Successfully Retrived Data from SPLUNK KVStore',
                    });
                    setTimeout(() => {
                        setInfoMessage({
                            visible: false,
                        });
                    }, 1000);
                } else {
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

    // const actionPrimary = <Button appearance="secondary" icon={<Pencil hideDefaultTooltip />} />;

    const actionsSecondaryMenuOne = (
        <Menu>
            <Menu.Item icon={<Refresh />}>Ability</Menu.Item>
            <Menu.Divider />
            <Menu.Item icon={<Clone />}>POW</Menu.Item>

            <Menu.Item icon={<Remove />}>Delete</Menu.Item>
        </Menu>
    );

    function SearchInputChange(event) {
        event.preventDefault();
        console.log(searchTerm);
    }

    // function handleCardSelect(event) {
    //     //event.preventDefault();
    //     console.log(event);
    //     // history.push("/view-asset");
    //     return  <Redirect  to={`/view-asset/_key=${event}`} />
    // }

    const handleClick = (e, { openInNewContext, to }) => {
        if (!openInNewContext && isInternalLink(to)) {
            e.preventDefault();
            window.alert(`In NavigationProvider click handler, to: ${to}`); // eslint-disable-line no-alert
        }
    };

    const lastpage = Math.ceil(assetValues.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = assetValues
        .sort((a, b) => (a.index_name > b.index_name ? 1 : -1))
        .slice(indexOfFirstPost, indexOfLastPost);

    const selectedValues = assetValues;
    // const Cards = currentPosts.sort((a, b) => a.index_name > b.index_name ? 1:-1).filter((selectedValues) => {
    const Cards = currentPosts
        .filter((selectedValues) => {
            if (searchTerm === '') {
                return selectedValues;
            }
            if (selectedValues.index_name.toLowerCase().includes(searchTerm)) {
                return selectedValues;
            }
        })
        .map((assetValue) => (
            <Card key={assetValue._key}>
                <Card.Header
                    title={assetValue.index_name}
                    subtitle={assetValue.index_size_mb}
                    actionsSecondary={actionsSecondaryMenuOne}
                    value={assetValue}
                    selected={includes(selectedValues, assetValue)}
                />
                <Card.Body>{assetValue.index_description}</Card.Body>
                <Card.Footer>
                    <NavigationProvider onClick={handleClick}>
                        <Button to={`view-asset?key=${assetValue._key}`} openInNewContext>
                            Details
                        </Button>
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
            <br></br>

            <Text
                style={{ float: 'right', width: '20%' }}
                defaultValue=""
                name="search_input"
                onChange={(event) => {
                    setSearchTerm(event.target.value.toLowerCase());
                }}
                endAdornment={
                    <>
                        <StyledButton
                            onClick={SearchInputChange}
                            appearance="pill"
                            icon={<Search />}
                        />
                    </>
                }
                inline
                placeholder="Enter index name to search"
            />
            <Select
                prefixLabel="Sort"
                name="sortby"

                onChange={(event, { value }) => {
                    setSortType(value);
                    console.log(sortType);
                }}
                value={sortType}
                defaultValue={sortType}
            >
                {SortByOptions.map((SortByOption) => (
                    <Select.Option
                        key={SortByOption.label}
                        label={SortByOption.label}
                        value={SortByOption.value}
                    />
                ))}
            </Select>
            <Select
                prefixLabel="Results to Display"
                name="ResultsPerPage"
                onChange={(event, { value }) => {
                    setPostsPerPage(value);
                }}
                value={postsPerPage}
                defaultValue={postsPerPage}
            >
                <Select.Option label="10" value="10" />
                <Select.Option label="20" value="20" />
                <Select.Option label="50" value="50" />
                <Select.Option label="100" value="100" />
            </Select>
            <Button
                icon={<Plus screenReaderText={null} />}
                label="Add New Asset"
                to={`view-asset?key=`}
                openInNewContext
                appearance="primary"
            />

            <SplunkThemeProvider family="prisma" colorScheme="light" density="comfortable">
                <div>
                    <CardLayout cardWidth={250} gutterSize={15} alignCards="left">
                        {Cards}
                    </CardLayout>
                </div>
                <Paginator
                    style={{ float: 'right', width: '30%' }}
                    current={currentPage}
                    totalPages={lastpage}
                    onChange={handlePaginatorChange}
                />
            </SplunkThemeProvider>
        </div>
    );
};

export default HomeDashboardReact;
