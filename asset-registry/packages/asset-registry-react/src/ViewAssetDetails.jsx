import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@splunk/react-ui/Button';
import Message from '@splunk/react-ui/Message';
import Text from '@splunk/react-ui/Text';
import RadioList from '@splunk/react-ui/RadioList';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Date from '@splunk/react-ui/Date';
import CollapsiblePanel from '@splunk/react-ui/CollapsiblePanel';
import { includes, without } from 'lodash';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import queryString from 'query-string'
// Custom Function imports
import { searchKVStore,insertKVStore } from './ManageKVStore';
import { validateAssetRegistryFormInput } from './FormValidate'




function  ViewAssetRegistryReact () {


    const [FormInputvalues, setFormInputValues] = useState({
        index_name: '',
        index_description: '',
        index_type:'Event',
        index_created_date:'2021-11-30',
        ags_entitlement_name:'',
        ability_app_name:'',
        splunk_role_name:'',
        index_size_mb:'100',
        _key:''
    })

    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [open, setOpen] = useState([{open:true,defaultOpen:true}]);
    const [formErrors, setFormErrors] = useState({});
    //const [isSubmit, setIsSubmit] = useState(false);
    // const [isSubmitDisabled, setisSubmitDisabled] = useState(true);
    // const [indexInputDisabled, setindexInputDisabled] = useState(false);


    //const [formInputValid, setFormInputValid] = useState({
    //    index_name_valid:false
    //});



    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };



    const handleDateChange = (event, {value}) => {
        setFormInputValues({ index_created_date: value });
    };

    const handleRequestClose = ({ panelId }) => {
            setOpen(without(open, panelId));
    };

    const handleRequestOpen = ({ panelId }) => {
            setOpen(open.concat(panelId));
    };


    const handleInputChange = (event) => {
        const {name, value} = event.target
        setFormInputValues({...FormInputvalues, [name]: value})
    }

    const clearState = () => {
        setFormInputValues({ index_name: '',
        index_description: '',
        index_type:'Event',
        index_created_date:'2021-11-30',
        ags_entitlement_name:'',
        ability_app_name:'',
        splunk_role_name:'',
        index_size_mb:'100',
        _key:''});


        setFormErrors ('');

      };

      useEffect(() => {
        let queries = queryString.parse(location.search)
        //console.log(queries);
        //onsole.log(queries.key);
        const defaultErrorMsg = 'There is some error in data retrival, please try again or refresh this page';
        searchKVStore('asset_registry_collection', queries.key, defaultErrorMsg)
            .then((response) => {
                if (response.ok ) {
                    response.json().then((data) => {
                        console.log(data);
                        setFormInputValues(data);
                    });
                    setTimeout(() => {
                        setInfoMessage({
                            visible: true,
                            type: 'success',
                            message: 'Successfully retrieved the data from SPLUNK KVStore',
                        });
                    }, 10);
                } else {
                    //setAssetValues(response.json);
                    setTimeout(() => {
                        setInfoMessage({
                            visible: true,
                            type: 'error',
                            message: 'Error in data Retrival from SPLUNK KVStore, please refresh the page',
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
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        const defaultErrorMsg = 'Error updating row. Please try again.';
        const InputformErrors = validateAssetRegistryFormInput(FormInputvalues);
        setFormErrors (InputformErrors);

        if (Object.keys(InputformErrors).length === 0) {
            insertKVStore('asset_registry_collection', FormInputvalues, defaultErrorMsg)
            .then((response) => {
                console.log(response);
                if (response.ok){

                setInfoMessage({
                    visible: true,
                    type: 'success',
                    message: 'Row successfully updated',
                });
                clearState();
            }
            else {
                setInfoMessage({
                    visible: true,
                    type: 'error',
                    message: 'There are some error from the Backend Splunk KVStore, Please try again',
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

        };

    }

    /* This function is to validate if an Index exist  */
    function handleIndexValidate(event) {
        event.preventDefault();
        const defaultErrorMsg = "There is some error from the SPLUNK KVStore"
        if (Object.keys(FormInputvalues.index_name).length !== 0) {
            searchKVStore('asset_registry_collection', FormInputvalues.index_name , '', defaultErrorMsg)
            .then((response) => {
                if (response.ok){
                setInfoMessage({
                    visible: true,
                    type: 'error',
                    message: 'There is alredy an entry exist for this index',
                });
            }
            else {
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
        }
        else{
            setInfoMessage({
                visible: true,
                type: 'error',
                message: 'Please enter a value in index name before Clicking Check Button',
            });
        };
    }

    return (
        <form>
                <SplunkThemeProvider family="prisma" colorScheme="light" density="comfortable">
                    {infoMessage.visible && (
                        <Message style={{ background: '#c3cbd4' }}
                            appearance="fill"
                            type={infoMessage.type || 'info'}
                            onRequestRemove={handleMessageRemove}

                        >
                            {infoMessage.message}
                        </Message>
                    )}
                    <CollapsiblePanel
                        title="Index Overview"
                        onRequestClose={handleRequestClose}
                        onRequestOpen={handleRequestOpen}
                        open={includes(open, 1)}
                        description="Basic details of the index"
                        panelId={1}
                    >
                        <ControlGroup label="Index Name" tooltip="Provide the Index Name to be created" help={formErrors.index_name_error}>
                            <Text
                                placeholder="index name"
                                name="index_name"
                                onChange={handleInputChange}
                                value={FormInputvalues.index_name}
                                error={formErrors.index_name_Invalid} />
                            <Button
                                label="Check"
                                appearance="primary"
                                type="submit"
                                value="IndexValidate"
                                onClick={handleIndexValidate} />
                        </ControlGroup>
                        <ControlGroup label="IndexDescription" tooltip="Provide a brief description of the index" help={formErrors.index_description_error}>
                            <Text
                                multiline
                                name="index_description"
                                inline
                                rowsMax={5}
                                onChange={handleInputChange}
                                value={FormInputvalues.index_description}
                                placeholder="e.g. This index contains << application | Security | Privacy | Sensitive >> data for OneSplunk Application"
                                error={formErrors.index_description_Invalid} />
                        </ControlGroup>
                        <ControlGroup label="Index Type" help={formErrors.index_type_error}>
                            <RadioList
                                name="index_type"
                                value={FormInputvalues.index_type}
                                onChange={handleInputChange}
                                error={formErrors.index_type_Invalid}
                            >
                                <RadioList.Option value="Event">Event</RadioList.Option>
                                <RadioList.Option value="Summary">Summary Event</RadioList.Option>
                                <RadioList.Option value="Metrics">Metrics</RadioList.Option>
                                <RadioList.Option value="SummaryMetrics"> Summary Metrics</RadioList.Option>
                            </RadioList>
                        </ControlGroup>
                        <ControlGroup label="Index Created Date" tooltip="Index Creation Date" help={formErrors.index_created_date_error}>
                            <Date
                                name="index_created_date"
                                value={FormInputvalues.index_created_date}
                                onChange={handleDateChange}
                                error={formErrors.index_created_date_Invalid} />
                        </ControlGroup>
                        {/* <ControlGroup label="AGS Entitlement Name" tooltip="Provide the AGS Entitlement Name, if not available then enter TBC or NA" help={formErrors.ags_entitlement_name_error}>
                            <Text
                                name="ags_entitlement_name"
                                placeholder="AGS Entitlement Name"
                                value={FormInputvalues.ags_entitlement_name}
                                onChange={handleInputChange}
                                error={formErrors.ags_entitlement_name_Invalid} />
                        </ControlGroup> */}
                        <ControlGroup label="Role Name" tooltip="Splunk Role Name" help={formErrors.splunk_role_name_error}>
                            <Text
                                name="splunk_role_name"
                                placeholder="splunk role name"
                                value={FormInputvalues.splunk_role_name}
                                onChange={handleInputChange}
                                error={formErrors.splunk_role_name_Invalid} />
                        </ControlGroup>
                        <ControlGroup label="Ability App Name" tooltip="Ability App Name">
                            <Text
                                name="ability_app_name"
                                placeholder="Ability App name"
                                value={FormInputvalues.ability_app_name}
                                onChange={handleInputChange} />
                        </ControlGroup>
                    </CollapsiblePanel>
                    <CollapsiblePanel
                        title="Index Retention Overview"
                        onRequestClose={handleRequestClose}
                        onRequestOpen={handleRequestOpen}
                        open={includes(open, 2)}
                        description="Index Retention Details"
                        panelId={2}
                    >
                        <ControlGroup label="Index Size Per day in MB" tooltip="Index Size Per day" help={formErrors.index_size_mb_error}>
                            <Text
                                name="index_size_mb"
                                inline
                                placeholder="Index Size in MB"
                                startAdornment={<div style={{ padding: '0 8px' }}>MB</div>}
                                value={FormInputvalues.index_size_mb}
                                onChange={handleInputChange}
                                error={formErrors.index_size_mb_Invalid} />
                        </ControlGroup>
                    </CollapsiblePanel>
                    <Button label="Submit" appearance="primary" type="submit" value="Submit" onClick={handleSubmit} />
                </SplunkThemeProvider>
            </form>
        );
}

export default ViewAssetRegistryReact;
