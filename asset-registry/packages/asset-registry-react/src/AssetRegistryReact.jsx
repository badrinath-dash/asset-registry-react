import React, { Component } from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import Message from '@splunk/react-ui/Message';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Text from '@splunk/react-ui/Text';
import RadioList from '@splunk/react-ui/RadioList';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Date from '@splunk/react-ui/Date';
import CollapsiblePanel from '@splunk/react-ui/CollapsiblePanel';
import { includes, without } from 'lodash';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
// Custom Function imports
import { StyledContainer, StyledGreeting, NotificationBox } from './AssetRegistryReactStyles';
import { updateKVEntry, SearchKVStore } from './data';
import {validateAssetRegistryFormInput} from './form-validate'

function  AssetRegistryReact () {

    const [FormInputvalues, FormInputsetValues] = useState({
        index_name: '',
        index_description: '',
        index_type:'Event',
        index_created_date:'2021-11-30',
        ags_entitlement_name:'',
        ability_app_name:'',
        splunk_role_name:'',
        index_size_mb:'100'
    })

    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [open, setOpen] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    //const [formInputValid, setFormInputValid] = useState({
    //    index_name_valid:false
    //});

    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };



    const handleDateChange = (event, {value}) => {
        FormInputsetValues({ index_created_date: value });
    };

    const handleRequestClose = ({ panelId }) => {
            setOpen(without(open, panelId));
    };

    const handleRequestOpen = ({ panelId }) => {
            setOpen(open.concat(panelId));
    };


    const handleInputChange = (event) => {
        const {name, value} = event.target
        FormInputsetValues({...FormInputvalues, [name]: value})
    }


    useEffect(() => {
       console.log(formErrors);
       if (Object.keys(formErrors).length === 0 && isSubmit ){
           console.log(FormInputvalues);
           setIsSubmit(true)
       }
    },[formErrors])

    function handleSubmit(event) {
        event.preventDefault();
        const defaultErrorMsg = 'Error updating row. Please try again.';
        const InputformErrors = validateAssetRegistryFormInput(FormInputvalues);
        setFormErrors (InputformErrors);


        if (Object.keys(InputformErrors).length === 0) {

            updateKVEntry('asset_registry_collection', FormInputvalues.index_name , FormInputvalues, defaultErrorMsg)
            .then((response) => {
                console.log(response);
                if (response.ok){
                setInfoMessage({
                    visible: true,
                    type: 'success',
                    message: 'Row successfully updated',
                });
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

    return (

        <form onSubmit={handleSubmit}>
            <SplunkThemeProvider family="prisma" colorScheme="light"  density="comfortable">
               {infoMessage.visible && (
                        <Message
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
                            canClear
                            placeholder="index name"
                            name="index_name"
                            onChange={handleInputChange}
                            value={FormInputvalues.index_name}
                            error={formErrors.index_name_valid}

                        />
                        <Button
                            label="Validate"
                            appearance="primary"
                            type="IndexValidate"
                            value="ValidateateIndex"

                        />
                    </ControlGroup>
                    <ControlGroup label="IndexDescription" tooltip="Provide a brief description of the index"help={formErrors.index_description_error} >
                        <Text
                            multiline
                            name="index_description"
                            inline
                            rowsMax={5}
                            onChange={handleInputChange}
                            value={FormInputvalues.index_description}
                            placeholder="e.g. This index contains << application | Security | Privacy | Sensitive >> data for OneSplunk Application"
                            error={formErrors.index_description_valid}
                        />
                    </ControlGroup>
                    <ControlGroup label="Index Type" help={formErrors.index_type_error}>
                        <RadioList
                            name="index_type"
                            value={FormInputvalues.index_type}
                            onChange={handleInputChange}
                            error={formErrors.index_type_valid}
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
                            error={formErrors.index_created_date_valid}
                        />
                    </ControlGroup>
                    <ControlGroup label="AGS Entitlement Name" tooltip="Provide the AGS Entitlement Name, if not available then enter TBC or NA" help={formErrors.ags_entitlement_name} >
                        <Text
                            name="ags_entitlement_name"
                            canClear
                            placeholder="AGS Entitlement Name"
                            value={FormInputvalues.ags_entitlement_name}
                            onChange={handleInputChange}
                            error={formErrors.ags_entitlement_name_valid}
                        />
                    </ControlGroup>
                    <ControlGroup label="Role Name" tooltip="Splunk Role Name" help={formErrors.splunk_role_name_error}>
                        <Text
                            name="splunk_role_name"
                            canClear
                            placeholder="splunk role name"
                            value={FormInputvalues.splunk_role_name}
                            onChange={handleInputChange}
                            error={formErrors.splunk_role_name_valid}
                        />
                    </ControlGroup>
                    <ControlGroup label="Ability App Name" tooltip="Ability App Name" >
                        <Text
                            name="ability_app_name"
                            canClear
                            placeholder="Ability App name"
                            value={FormInputvalues.ability_app_name}
                            onChange={handleInputChange}
                        />
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
                            error={formErrors.index_size_mb_valid}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <Button label="Submit" appearance="primary" type="submit" value="Submit" />
             </SplunkThemeProvider>
            </form>
        );
}

export default AssetRegistryReact;
