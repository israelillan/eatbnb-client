import React from 'react';
import {Backdrop, CircularProgress} from "@material-ui/core";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {selectLoading} from "../../redux/backend/backend.selectors";

const LoadingFromBackend = ({loading}) => {
    return <Backdrop open={loading}>
        <CircularProgress/>
    </Backdrop>;
}

export default connect(
    createStructuredSelector({
        loading: selectLoading
    }))(LoadingFromBackend);