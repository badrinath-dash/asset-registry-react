import React from 'react';
import { useState, useEffect} from 'react';
import Button from '@splunk/react-ui/Button';
import Message from '@splunk/react-ui/Message';
import Text from '@splunk/react-ui/Text';
import TabLayout from '@splunk/react-ui/TabLayout';
import RadioList from '@splunk/react-ui/RadioList';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Date from '@splunk/react-ui/Date';
import CollapsiblePanel from '@splunk/react-ui/CollapsiblePanel';
import { includes, without } from 'lodash';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import queryString from 'query-string';
import Select from '@splunk/react-ui/Select';
import Multiselect from '@splunk/react-ui/Multiselect';
import SidePanel from '@splunk/react-ui/SidePanel';
import {Timeline, TimelineEvent} from 'react-event-timeline'


// Custom Function imports
import { searchKVStore, updateKVStore } from './ManageKVStore';
import { IndexClusterDropDownOptions, ArchitectDropDownOptions, data} from './DropDownData';
import { validateAssetRegistryFormInput } from './FormValidate';

function ViewAssetRegistryReact() {
    const defaultValues = ['1', '2'];
    const [FormInputvalues, setFormInputValues] = useState({
        index_name: '',
        index_description: '',
        index_type: 'Event',
        index_created_date: '2021-11-30',
        ags_entitlement_name: '',
        ability_app_name: '',
        splunk_role_name: '',
        index_size_mb: '100',
        index_created_by: '',
        index_retention_period: '',
        source_application_contact: '',
        source_application_manager: '',
        source_itam_bsa: '',
        source_data_owner: '',
        pow_onboarding_url: '',
        source_app_sad_url: '',
        on_boarding_form_url: '',
        index_customer_segment: '',
        index_classification:'',
        index_cluster:[],
        _key: '',
    });

    const [open1, setOpen1] = useState(false);
    const [panelSize, setPanelSize] = useState(300);

    const togglePanelOpen = () => {
        setOpen1(!open1);
    };

    const handleChangePanelSize = (e, { value }) => {
        setPanelSize(value);
    };


    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [open, setOpen] = useState([]);
    const [inputDisabled, setinputDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const [editButtonDisabled, setEditButtongDisabled] = useState(false);
    const [checkButtonDisabled, setcheckButtonDisabled] = useState(true);
    const [InputValues, setInputValues] = useState(['1', '2']);
    const [activePanelId, setActivePanelId] = useState('one');

    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };

    const handleDateChange = (event, { value }) => {
        setFormInputValues({ ...FormInputvalues, index_created_date: value });
    };

    const handleRequestClose = ({ panelId }) => {
        setOpen(without(open, panelId));
    };

    const handleRequestOpen = ({ panelId }) => {
        setOpen(open.concat(panelId));
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormInputValues({ ...FormInputvalues, [name]: value });
    };

    const handleEdit = (event) => {
        event.preventDefault();
        setinputDisabled(false);
        setEditButtongDisabled(true);
    };

    function refreshPage() {
        window.location.reload(false);
    }

    const handleDropDownChange = (e, { value }) => {
        setFormInputValues({ ...FormInputvalues, index_created_by: value });
        console.log(FormInputvalues);
    };

    const handleDropDownChange1 = (e, { values }) => {
       setFormInputValues({ ...FormInputvalues, index_cluster: values
     });

    };





    const handleTabChange = (e, { activePanelId: panelId }) => {
        setActivePanelId(panelId);
    };
    const clearState = () => {
        setFormInputValues({
            index_name: '',
        index_description: '',
        index_type: 'Event',
        index_created_date: '2021-11-30',
        ags_entitlement_name: '',
        ability_app_name: '',
        splunk_role_name: '',
        index_size_mb: '100',
        index_created_by: '',
        index_retention_period: '',
        source_application_contact: '',
        source_application_manager: '',
        source_itam_bsa: '',
        source_data_owner: '',
        pow_onboarding_url: '',
        source_app_sad_url: '',
        on_boarding_form_url: '',
        index_customer_segment: '',
        index_classification:'',
        index_cluster:[],
        _key: '',
        });

        setFormErrors('');
    };

    function getAssetRegistryData(event) {
        let queries = queryString.parse(location.search);
        const defaultErrorMsg =
            'There is some error in data retrival, please try again or refresh this page';
        searchKVStore('asset_registry_collection', queries.key, '', defaultErrorMsg)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log(data);
                        setFormInputValues(data);
                        setinputDisabled(true);
                    });
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'Successfully retrieved the data from SPLUNK KVStore',
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
                        type: 'error',
                        message:
                            'Error in data Retrival from SPLUNK KVStore, please refresh the page',
                    });
                    setTimeout(() => {
                        setInfoMessage({
                            visible: false,
                        });
                    }, 1000);
                }
            })
            .catch((defaultErrorMsg) => {
                setInfoMessage({
                    visible: true,
                    type: 'error',
                    message: defaultErrorMsg,
                });
            });
    }

    useEffect(() => {
        let queries = queryString.parse(location.search);
        var openPanel = [1, 2, 3, 4, 5];
        if (queries.key.length === 0) {
            setOpen(open.concat(openPanel));
            setcheckButtonDisabled(false);
            setEditButtongDisabled(true);
        } else {
            console.log(queries.key.length);
            getAssetRegistryData();
            setOpen(open.concat(openPanel));
        }
        //setOpen(open.concat(0));

        //console.log(queries);
        //onsole.log(queries.key);
        //getAssetRegistryData();
    }, []);

    function handleSubmit(event) {
        let queries = queryString.parse(location.search);
        event.preventDefault();
        const defaultErrorMsg = 'Error updating row. Please try again.';
        const InputformErrors = validateAssetRegistryFormInput(FormInputvalues);
        setFormErrors(InputformErrors);

        if (Object.keys(InputformErrors).length === 0) {
            updateKVStore(
                'asset_registry_collection',
                queries.key,
                FormInputvalues,
                defaultErrorMsg
            )
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        setInfoMessage({
                            visible: true,
                            type: 'success',
                            message: 'Row successfully updated',
                        });
                        //refreshPage();
                        getAssetRegistryData();
                        setinputDisabled(true);
                        setEditButtongDisabled(false);
                    } else {
                        setInfoMessage({
                            visible: true,
                            type: 'error',
                            message:
                                'There are some error from the Backend Splunk KVStore, Please try again',
                        });
                    }
                })
                .catch((err) => {
                    setInfoMessage({
                        visible: true,
                        type: 'error',
                        message: err,
                    });
                });
        }
    }

    /* This function is to validate if an Index exist  */
    function handleIndexValidate(event) {
        event.preventDefault();
        const defaultErrorMsg = 'There is some error from the SPLUNK KVStore';
        if (Object.keys(FormInputvalues.index_name).length !== 0) {
            searchKVStore(
                'asset_registry_collection',
                '',
                `{"index_name":"${FormInputvalues.index_name}"}`,
                defaultErrorMsg
            )
                .then((response) => {
                    if (response.ok) {
                        setInfoMessage({
                            visible: true,
                            type: 'error',
                            message: 'There is alredy an entry exist for this index',
                        });
                        setTimeout(() => {
                            setInfoMessage({
                                visible: false,
                            });
                        }, 1000);
                    } else {
                        // setisSubmitDisabled(false)
                        // setindexInputDisabled(true)
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
        } else {
            setInfoMessage({
                visible: true,
                type: 'error',
                message: 'Please enter a value in index name before Clicking Check Button',
            });
        }
    }

    return (
        <form>

            <SplunkThemeProvider family="prisma" colorScheme="light" density="comfortable">
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
                <TabLayout activePanelId={activePanelId} onChange={handleTabChange}>
                <TabLayout.Panel label="Index OverView" panelId="one" style={{ margin: 20 }}>
                <CollapsiblePanel
                    title="Index Overview"
                    onRequestClose={handleRequestClose}
                    onRequestOpen={handleRequestOpen}
                    open={includes(open, 1)}
                    description="Basic details of the index"
                    panelId={1}
                >
                    <ControlGroup
                        label="Index Name"
                        tooltip="Provide the Index Name to be created"
                        help={formErrors.index_name_error}
                    >
                        <Text
                            placeholder="index name"
                            name="index_name"
                            onChange={handleInputChange}
                            value={FormInputvalues.index_name}
                            error={formErrors.index_name_Invalid}
                            disabled={inputDisabled}
                        />
                        <Button
                            disabled={checkButtonDisabled}
                            label="Check"
                            appearance="primary"
                            type="submit"
                            value="IndexValidate"
                            onClick={handleIndexValidate}
                        />
                    </ControlGroup>
                    <ControlGroup
                        label="IndexDescription"
                        tooltip="Provide a brief description of the index"
                        help={formErrors.index_description_error}
                    >
                        <Text
                            multiline
                            name="index_description"
                            inline
                            rowsMax={5}
                            onChange={handleInputChange}
                            value={FormInputvalues.index_description}
                            placeholder="e.g. This index contains << application | Security | Privacy | Sensitive >> data for OneSplunk Application"
                            error={formErrors.index_description_Invalid}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup
                        label="Role Name"
                        tooltip="Splunk Role Name"
                        help={formErrors.splunk_role_name_error}
                    >
                        <Text
                            name="splunk_role_name"
                            placeholder="splunk role name"
                            value={FormInputvalues.splunk_role_name}
                            onChange={handleInputChange}
                            error={formErrors.splunk_role_name_Invalid}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Ability App Name" tooltip="Ability App Name">
                        <Text
                            name="ability_app_name"
                            placeholder="Ability App name"
                            value={FormInputvalues.ability_app_name}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup
                        label="AGS Entitlement Name"
                        tooltip="AGS Entitlement Name for Accessing this index"
                    >
                        <Text
                            name="ags_entitlement_name"
                            placeholder="AGS Entitlement Name"
                            value={FormInputvalues.ags_entitlement_name}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <CollapsiblePanel
                    title="Index Retentention Overview"
                    onRequestClose={handleRequestClose}
                    onRequestOpen={handleRequestOpen}
                    open={includes(open, 2)}
                    description="Index Details"
                    panelId={2}
                >
                    <ControlGroup
                        label="Index Size Per day in MB"
                        tooltip="Index Size Per day"
                        help={formErrors.index_size_mb_error}
                    >
                        <Text
                            name="index_size_mb"
                            placeholder="Index Size in MB"
                            endAdornment={<div style={{ padding: '0 8px' }}>MB</div>}
                            value={FormInputvalues.index_size_mb}
                            onChange={handleInputChange}
                            error={formErrors.index_size_mb_Invalid}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Index Created By" help={formErrors.index_created_by_error}>
                        <Select
                            name="index_created_by"
                            value={FormInputvalues.index_created_by}
                            onChange={handleDropDownChange}
                            error={formErrors.index_created_by_Invalid}
                            disabled={inputDisabled}
                        >
                           {ArchitectDropDownOptions.map(ArchitectDropDownOption =>  <Select.Option  key={ArchitectDropDownOption.label} label={ArchitectDropDownOption.label} value={ArchitectDropDownOption.value} />)}
                        </Select>
                    </ControlGroup>
                    <ControlGroup label="Index Type" help={formErrors.index_type_error}>
                        <RadioList
                            name="index_type"
                            value={FormInputvalues.index_type}
                            onChange={handleInputChange}
                            error={formErrors.index_type_Invalid}
                            disabled={inputDisabled}
                        >
                            <RadioList.Option value="Event">Event</RadioList.Option>
                            <RadioList.Option value="Summary">Summary Event</RadioList.Option>
                            <RadioList.Option value="Metrics">Metrics</RadioList.Option>
                            <RadioList.Option value="SummaryMetrics">
                                {' '}
                                Summary Metrics
                            </RadioList.Option>
                        </RadioList>
                    </ControlGroup>
                    <ControlGroup
                        label="Index Created Date"
                        tooltip="Index Creation Date"
                        help={formErrors.index_created_date_error}
                    >
                        <Date
                            name="index_created_date"
                            value={FormInputvalues.index_created_date}
                            onChange={handleDateChange}
                            error={formErrors.index_created_date_Invalid}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup
                        label="Index Retention Period"
                        tooltip="Index Retention days"
                        help={formErrors.index_retention_period_error}
                    >
                        <Text
                            name="index_retention_period"
                            placeholder="Index Retention Period"
                            endAdornment={<div style={{ padding: '0 8px' }}>Days</div>}
                            value={FormInputvalues.index_retention_period}
                            onChange={handleInputChange}
                            error={formErrors.index_retention_period_Invalid}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <CollapsiblePanel
                    title="Application Contact Details"
                    onRequestClose={handleRequestClose}
                    onRequestOpen={handleRequestOpen}
                    open={includes(open, 3)}
                    description="Application Contact Details"
                    panelId={3}
                >
                    <ControlGroup label="Source Application Contact">
                        <Text
                            name="source_application_contact"
                            placeholder="Source Application Contact Email"
                            value={FormInputvalues.source_application_contact}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Source Application Manager">
                        <Text
                            name="source_application_manager"
                            placeholder="Source Application Manager Email"
                            value={FormInputvalues.source_application_manager}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Source ITAM BSA Name">
                        <Text
                            name="source_itam_bsa"
                            placeholder="Souce ITAM BSA"
                            value={FormInputvalues.source_itam_bsa}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Source System Data Owner">
                        <Text
                            name="source_data_owner"
                            placeholder="Souce Data Owner Email"
                            value={FormInputvalues.source_data_owner}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <CollapsiblePanel
                    title="Documentation Link"
                    onRequestClose={handleRequestClose}
                    onRequestOpen={handleRequestOpen}
                    open={includes(open, 4)}
                    description="Application Documentation Links"
                    panelId={4}
                >
                    <ControlGroup label="POW URL">
                        <Text
                            name="pow_onboarding_url"
                            placeholder="POW On-boarding URL"
                            value={FormInputvalues.pow_onboarding_url}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="On-boarding Form URL">
                        <Text
                            name="on_boarding_form_url"
                            placeholder="On-boarding URL Form except POW"
                            value={FormInputvalues.onboarding_form_url}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                    <ControlGroup label="Application SAD URL">
                        <Text
                            name="source_app_sad_url"
                            placeholder="Souce Application SAD URL"
                            value={FormInputvalues.source_app_sad_url}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <CollapsiblePanel
                    title="Data Classification"
                    onRequestClose={handleRequestClose}
                    onRequestOpen={handleRequestOpen}
                    open={includes(open, 5)}
                    description="Classification of data in Index"
                    panelId={5}
                >
                    <ControlGroup label="Customer Segment">
                        <RadioList
                            direction="row"
                            name="index_customer_segment"
                            value={FormInputvalues.index_customer_segment}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        >
                            <RadioList.Option value="Retail">Retail</RadioList.Option>
                            <RadioList.Option value="WholeSale">WholeSale</RadioList.Option>
                            <RadioList.Option value="Telstra Business/Government">
                                Telstra Business/Government
                            </RadioList.Option>
                            <RadioList.Option value="Non Separated">Non Separated</RadioList.Option>
                        </RadioList>
                    </ControlGroup>
                    <ControlGroup label="Index Classification">
                        <RadioList
                            direction="row"
                            name="index_classification"
                            value={FormInputvalues.index_classification}
                            onChange={handleInputChange}
                            disabled={inputDisabled}
                        >
                            <RadioList.Option value="Application">Application</RadioList.Option>
                            <RadioList.Option value="Security">Security</RadioList.Option>
                            <RadioList.Option value="Non Separated">Non Separated</RadioList.Option>
                        </RadioList>
                    </ControlGroup>
                    <ControlGroup label="Index Cluster">
                        <Multiselect
                        //defaultValues={defaultValues}
                            disabled={inputDisabled}
                            name="index_cluster"
                            values={FormInputvalues.index_cluster}
                            onChange={handleDropDownChange1}
                            inline

                        >
                            {IndexClusterDropDownOptions.map(IndexClusterDropDownOption =>  <Multiselect.Option  label={IndexClusterDropDownOption.label} value={IndexClusterDropDownOption.value} />)}
                        </Multiselect>
                    </ControlGroup>
                </CollapsiblePanel>
                </TabLayout.Panel>
                <TabLayout.Panel label="Index History" panelId="two" style={{ margin: 20 }}>
                <Timeline>
            <TimelineEvent title="Bismaya Pattanaik"
            titleStyle={{ fontWeight: "bold" }}
                           createdAt="2022-01-02 10:06 PM"
                           style={{ fontSize: "100%" }}



            >
                Index Size Increased from 100 GB to 200 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}

            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
            <TimelineEvent
                title="System Modified"
                createdAt="2021-09-11 09:06 AM"
                style={{ fontSize: "100%" }}


            >
                Index Size Increased from 10 GB to 100 GB
            </TimelineEvent>
    </Timeline>
</TabLayout.Panel>
</TabLayout>

                <SidePanel
                open={open1}
                dockPosition="right"
                onRequestClose={togglePanelOpen}
                innerStyle={{ width: panelSize ?? 300 }}
            >
 Telstra
            </SidePanel>
                <Button
                    label="Save"
                    appearance="primary"
                    type="submit"
                    value="Submit"
                    onClick={handleSubmit}
                />
                <Button
                    label="Edit"
                    appearance="primary"
                    type="edit"
                    value="Edit"
                    onClick={handleEdit}
                    disabled={editButtonDisabled}
                >
                    {' '}
                </Button>
                <Button appearance="primary" onClick={togglePanelOpen} label="View History" />
            </SplunkThemeProvider>
        </form>
    );
}

export default ViewAssetRegistryReact;
