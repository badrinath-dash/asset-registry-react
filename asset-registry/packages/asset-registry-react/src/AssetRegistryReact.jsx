import React, { Component } from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@splunk/react-ui/Button';
import { StyledContainer, StyledGreeting, FormArea } from './AssetRegistryReactStyles';
import Message from '@splunk/react-ui/Message';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Text from '@splunk/react-ui/Text';
import RadioList from '@splunk/react-ui/RadioList';
import ControlGroup from '@splunk/react-ui/ControlGroup';
import Date from '@splunk/react-ui/Date';
import Number from '@splunk/react-ui/Number';
import RadioBar from '@splunk/react-ui/RadioBar';
import Select from '@splunk/react-ui/Select';
import CollapsiblePanel from '@splunk/react-ui/CollapsiblePanel';
import * as config from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';
import { handleError, handleResponse } from '@splunk/splunk-utils/fetch';
import { updateKVEntry,SearchKVStore } from './data';

class AssetRegistryReact extends Component {


    constructor(props) {
        super(props);

        this.state = {
            index_name: '',
            index_description: '',
            index_created_date: '2021-11-27',
            ags_entitlement_name: '',
            splunk_app_name: '',
            ability_app_name: '',
            splunk_role_name: '',
            index_size_mb: '',
            open: {setOpen: true },
            infoMessage:{visible: false},
            setInfoMessage:{visible: false}
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleIndexValidate = this.handleIndexValidate.bind(this);
        // this.handleRequestClose = this.handleSubmit.bind(this);
        // this.handleRequestOpen = this.handleSubmit.bind(this);
        // this.handleMessageRemove = this.handleSubmit.bind(this);

    }

    handleMessageRemove = () => {
        this.setState({ infoMessage:{visible: false} });
    };

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleDateChange = (e, { value }) => {
        this.setState({ 'index_created_date': value });
    };

    handleRequestClose = () => {
        this.setState({ 'setOpen': false });
        this.setState({ 'open': false });
    };

    handleRequestOpen = () => {
        this.setState({ 'setOpen': true });
        this.setState({ 'open': true });
    };



    handleSubmit(event) {
        event.preventDefault();
        const defaultErrorMsg = 'Error updating row. Please try again.';
        // this.setState({infoMessage:{visible: true}});
        // this.setState({setInfoMessage:{visible: true}});
        updateKVEntry('asset_registry_collection', "", this.state, defaultErrorMsg)
            .then(() => {
                this.setState({infoMessage:{visible: true,type:'success',message:'Row successfully updated'}});
                console.log('Row successfully updated');
                this.setState(this.state);
                // all fine, update tableData
            })
            .catch((err) => {
                console.log('Update to KV Failed' + err);
            });

    };

    handleIndexValidate(event) {
        event.preventDefault();
        const response = ''
        const defaultErrorMsg = 'Error updating row. Please try again.';
        // this.setState({infoMessage:{visible: true}});
        // this.setState({setInfoMessage:{visible: true}});
        SearchKVStore('asset_registry_collection', this.state.index_name,  defaultErrorMsg)
            .then(() => {
                this.setState({infoMessage:{visible: true,type:'error',message:'Entry For this Asset already exist'}});
                console.log(response);
                // all fine, update tableData
            })
            .catch((err) => {
                this.setState({infoMessage:{visible: true,type:'success',message:'No entry exist for this index'}});
            });

    };

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <ControlGroup>
                <Message
                    appearance="fill"
                    type={this.state.infoMessage.type || 'info'}
                    onRequestRemove={this.handleMessageRemove}
                >
                    {this.state.infoMessage.message}
                </Message>
                </ControlGroup>

                <CollapsiblePanel
                    title="Index Overview"
                    onRequestClose={this.handleRequestClose}
                    onRequestOpen={this.handleRequestOpen}
                    open={this.state.open}
                    description="Basic details of the index"
                    panelId={1}
                >
                    <ControlGroup label="Index Name" tooltip="Provide the Index Name to be created">
                        <Text required canClear defaultValue="" placeholder="index name" name="index_name" value={this.state.index_name} onChange={this.handleChange} />
                        <Button label="Validate" appearance="primary" type="IndexValidate" value="ValidateateIndex" onClick={this.handleIndexValidate} />
                    </ControlGroup>
                    <ControlGroup label="IndexDescription" tooltip="Provide a brief description of the index">
                        <Text
                            multiline
                            name="index_description"
                            inline
                            rowsMax={5}
                            value={this.state.index_description}
                            onChange={this.handleChange}
                            placeholder="e.g. This index contains << application | Security | Privacy | Sensitive >> data for OneSplunk Application"

                        />
                    </ControlGroup>


                    <ControlGroup label="Index Type" >
                        <RadioList name="index_type" value={this.state.index_type} onChange={this.handleChange}>
                            <RadioList.Option value="Event">Event</RadioList.Option>
                            <RadioList.Option value="Summary">Summary Event</RadioList.Option>
                            <RadioList.Option value="Metrics">Metrics</RadioList.Option>
                            <RadioList.Option value="SummaryMetrics">Summary Metrics</RadioList.Option>
                        </RadioList>
                    </ControlGroup>
                    <ControlGroup label="Index Created Date" tooltip="Index Creation Date" >
                        <Date name="index_created_date" value={this.state.index_created_date} onChange={this.handleDateChange} />
                    </ControlGroup>
                    <ControlGroup label="AGS Entitlement Name" tooltip="Provide the AGS Entitlement Name, if not available then enter TBC or NA" >
                        <Text name="ags_entitlement_name" canClear defaultValue="" placeholder="AGS Entitlement Name" value={this.state.ags_entitlement_name}
                            onChange={this.handleChange} />
                    </ControlGroup>
                    <ControlGroup label="Role Name" tooltip="Splunk Role Name" >
                        <Text name="splunk_role_name" canClear defaultValue="" placeholder="splunk role name" value={this.state.splunk_role_name}
                            onChange={this.handleChange} />
                    </ControlGroup>
                    <ControlGroup label="Ability App Name" tooltip="Ability App Name">
                        <Text name="ability_app_name" canClear defaultValue="" placeholder="Ability App name" value={this.state.ability_app_name}
                            onChange={this.handleChange} />
                    </ControlGroup>

                </CollapsiblePanel>
                <CollapsiblePanel defaultOpen="true" title="Index Retention Overview" description="Basic details of the index" >
                    <ControlGroup label="Index Size Per day in MB" tooltip="Index Size Per day" >
                        <Text
                            name="index_size_mb"
                            defaultValue=""
                            inline
                            placeholder="Index Size in MB"
                            startAdornment={<div style={{ padding: '0 8px' }}>MB</div>}
                            value={this.state.index_size_mb}
                            onChange={this.handleChange}
                        />
                    </ControlGroup>
                </CollapsiblePanel>
                <Button label="Submit" appearance="primary" type="submit" value="Submit" />
            </form>
        );
    }
}

export default AssetRegistryReact;
