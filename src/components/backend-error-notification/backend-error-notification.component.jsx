import React from 'react';
import {Alert, Snackbar} from "@material-ui/core";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectError} from "../../redux/backend/backend.selectors";
import {clearBackendError} from "../../redux/backend/backend.actions";

const BackendErrorNotification = ({error, dispatchClearError}) => {
    return <Snackbar open={!!error} autoHideDuration={6000} onClose={dispatchClearError}>
        <Alert onClose={dispatchClearError} severity="warning" sx={{width: '100%'}}>
            { error ? `${JSON.stringify(error)}` : null}
        </Alert>
    </Snackbar>;
}

export default connect(
    createStructuredSelector({
        error: selectError
    }),
    dispatch => ({
        dispatchClearError: () => dispatch(clearBackendError())
    })
)(BackendErrorNotification);