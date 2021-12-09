import React, { useState, useEffect, useCallback } from 'react';
import SplunkThemeProvider from '@splunk/themes/SplunkThemeProvider';
import Message from '@splunk/react-ui/Message';
import Card from '@splunk/react-ui/Card';
import DL from '@splunk/react-ui/DefinitionList';
//import profiles from "./data.json";
import { searchKVStore } from './ManageKVStore';
import  { item, card } from './AssetRegistryReactStyles';

const HomeDashboardReact = () => {
    const [infoMessage, setInfoMessage] = useState({ visible: false });
    const [products, setProducts] = useState([]);
    const handleMessageRemove = () => {
        setInfoMessage({ visible: false });
    };

    useEffect(() => {
        const defaultErrorMsg = 'There is some error in data retrival, please try again';
        searchKVStore('asset_registry_collection', '', '', defaultErrorMsg)
            .then((response) => {
                if (response.ok) {
                    response.json().then(data => {
                        console.log(data);
                        setProducts(data);
                      });
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'Data Retrival from KVStore',
                    });
                } else {
                    setProducts(response.json);
                    setInfoMessage({
                        visible: true,
                        type: 'success',
                        message: 'No entry exist for this index',
                    });
                }
            })
            .then((data) => {
                console.log(data);
            })
            .catch((defaultErrorMsg) => {
                setInfoMessage({
                    visible: true,
                    type: 'error',
                    message: defaultErrorMsg,
                });
            });

    }, []);

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
            <SplunkThemeProvider family="prisma" colorScheme="light" density="comfortable">
                 <div className={card}>
                    {products.map((product) => (
                        <div className={item} key={product._key}>
                            <p>{product.index_name}</p>
                        </div>
                    ))}
                </div>

            </SplunkThemeProvider>
        </div>
    );
};

export default HomeDashboardReact;
