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
import queryString from 'query-string';
import Select from '@splunk/react-ui/Select';
import Switch from '@splunk/react-ui/Switch';
// Custom Function imports
import { searchKVStore,insertKVStore,updateKVStore } from './ManageKVStore';
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
        index_created_by:'',
        _key:''
    })

    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [open, setOpen] = useState([]);
    const [inputDisabled, setinputDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState({});


    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };



    const handleDateChange = (event, {value}) => {
        setFormInputValues({ index_created_date: value });
    };

    const handleDropDownChange = (event, {value}) => {
        setFormInputValues({ index_created_by: value });
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

    const handleEdit = (event) => {
        event.preventDefault();
        setinputDisabled(false);
    }

    function refreshPage() {
    window.location.reload(false);
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
        index_created_by:'1',
        _key:''});

        setFormErrors ('');

      };

      useEffect(() => {
        let queries = queryString.parse(location.search)
        var openPanel = [1,2,3,4];
        //setOpen(open.concat(0));
        setOpen(open.concat(openPanel));
        //console.log(queries);
        //onsole.log(queries.key);
        const defaultErrorMsg = 'There is some error in data retrival, please try again or refresh this page';
        searchKVStore('asset_registry_collection', queries.key, defaultErrorMsg)
            .then((response) => {
                if (response.ok ) {
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
                            message: 'Error in data Retrival from SPLUNK KVStore, please refresh the page',
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
    }, []);

    function handleSubmit(event) {
        let queries = queryString.parse(location.search)
        event.preventDefault();
        const defaultErrorMsg = 'Error updating row. Please try again.';
        const InputformErrors = validateAssetRegistryFormInput(FormInputvalues);
        setFormErrors (InputformErrors);

        if (Object.keys(InputformErrors).length === 0) {
            updateKVStore('asset_registry_collection',  queries.key,FormInputvalues, defaultErrorMsg)
            .then((response) => {
                console.log(response);
                if (response.ok){

                setInfoMessage({
                    visible: true,
                    type: 'success',
                    message: 'Row successfully updated',
                });
               refreshPage();
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
                setTimeout(() => {
                    setInfoMessage({
                        visible: false,
                    });
                }, 1000);
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
                                error={formErrors.index_name_Invalid}
                                disabled={inputDisabled} />
                            <Button
                                disabled
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
                                error={formErrors.index_description_Invalid}
                                disabled={inputDisabled}/>
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
                                <RadioList.Option value="SummaryMetrics"> Summary Metrics</RadioList.Option>
                            </RadioList>
                        </ControlGroup>
                        <ControlGroup label="Index Created Date" tooltip="Index Creation Date" help={formErrors.index_created_date_error}>
                            <Date
                                name="index_created_date"
                                value={FormInputvalues.index_created_date}
                                onChange={handleDateChange}
                                error={formErrors.index_created_date_Invalid}
                                 disabled={inputDisabled}
                               />
                        </ControlGroup>
                        <ControlGroup label="Role Name" tooltip="Splunk Role Name" help={formErrors.splunk_role_name_error}>
                            <Text
                                name="splunk_role_name"
                                placeholder="splunk role name"
                                value={FormInputvalues.splunk_role_name}
                                onChange={handleInputChange}
                                error={formErrors.splunk_role_name_Invalid}
                                disabled={inputDisabled} />
                        </ControlGroup>
                        <ControlGroup label="Ability App Name" tooltip="Ability App Name">
                            <Text
                                name="ability_app_name"
                                placeholder="Ability App name"
                                value={FormInputvalues.ability_app_name}
                                onChange={handleInputChange}
                                disabled={inputDisabled} />
                        </ControlGroup>
                    </CollapsiblePanel>
                    <CollapsiblePanel
                       title="Index Retentention Overview"
                        onRequestClose={handleRequestClose}
                        onRequestOpen={handleRequestOpen}
                        open={includes(open, 2)}
                        description="Basic details of the index"
                        panelId={2}
                    >
                        <ControlGroup label="Index Size Per day in MB" tooltip="Index Size Per day" help={formErrors.index_size_mb_error}>
                            <Text
                                name="index_size_mb"
                                placeholder="Index Size in MB"
                                startAdornment={<div style={{ padding: '0 8px' }}>MB</div>}
                                value={FormInputvalues.index_size_mb}
                                onChange={handleInputChange}
                                error={formErrors.index_size_mb_Invalid}
                                disabled={inputDisabled}
                                />
                        </ControlGroup>
<ControlGroup label="Index Created By" tooltip="Index Created By" help={formErrors.index_created_by_error}>
                <Select
                name="index_created_by"
                value={FormInputvalues.index_created_by}
                onChange={handleDropDownChange}
                error={formErrors.index_created_by_Invalid}
                disabled={inputDisabled}>

                <Select.Option label="Abhiradh Naidu" value="Abhiradh.Naidu@team.telstra.com" />
                <Select.Option label="Andrew Garde" value="Andrew.Garde@team.telstra.com" />
                <Select.Option label="Angelus Sunith" value="Angelus.Sunith@team.telstra.com" />
                <Select.Option label="Badri Dash" value="Badri.Dash@team.telstra.com" />
                <Select.Option label="Bismaya Pattanaik" value="Bismaya.Pattanayak@team.telstra.com" />
                <Select.Option label="Feroz Faruk Basha" value="Feroz.Basha@team.telstra.com" />
                <Select.Option label="Gareth Anderson" value="Gareth.Anderson@team.telstra.com" />
                <Select.Option label="Jay Regunathan" value="Jay.Regunathan@team.telstra.com" />
                <Select.Option label="Lucas Khoo" value="Lucas.khoo@team.telstra.com" />
                <Select.Option label="Mike O'Neill" value="Michael.ONeill@team.telstra.com" />
                <Select.Option label="Murali Jaganathan" value="Muralidharan.Jaganathan@team.telstra.com" />
                 <Select.Option label="Purani Mahendran" value="Purani.Mahendran@team.telstra.com" />
                <Select.Option label="Shyam Kosanam" value="Shyam.Kosanam@team.telstra.com" />
            </Select>
                        </ControlGroup>
                    </CollapsiblePanel>
                    <Button label="Save" appearance="primary" type="submit" value="Submit" onClick={handleSubmit} />
                     <Button label="Edit" appearance="primary" type="edit" value="Edit" onClick={handleEdit}> </Button>
                </SplunkThemeProvider>
            </form>
        );
}

export default ViewAssetRegistryReact;
