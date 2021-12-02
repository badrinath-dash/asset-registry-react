function validateAssetRegistryFormInput(values) {
    const errors = {};

    if (!values.index_name) {
        errors.index_name_error = "Index Name is required";
        errors.index_name_Invalid = true;
    }
    if (!values.index_description) {
        errors.index_description_error = "Index Description is required"
        errors.index_description_Invalid = true;
    }
    if (!values.index_type) {
        errors.index_type_error = "Index Type is required"
        errors.index_type_Invalid = true;
    }
    if (!values.index_created_date) {
        errors.index_created_date_error = "Index Created Date is required"
        errors.index_created_date_Invalid = true;
    }
    if (!values.ags_entitlement_name) {
        errors.ags_entitlement_name_error = "AGS Entitlement Name is required"
        errors.ags_entitlement_name_Invalid = true;
    }
    if (!values.splunk_role_name) {
        errors.splunk_role_name_error = "Splunk Role Name is required"
        errors.splunk_role_name_Invalid = true;
    }
    if (!values.index_size_mb) {
        errors.index_size_mb_error = "Index Size is required"
        errors.index_size_mb_Invalid = true;
    }

    return errors
}

export { validateAssetRegistryFormInput };