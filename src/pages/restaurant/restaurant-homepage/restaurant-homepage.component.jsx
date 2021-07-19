import React, {useEffect, useState} from 'react';
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Col, Row} from "react-bootstrap";
import {DatePicker} from "@material-ui/lab";
import {Container, Divider, Grid, Paper, Stack, TextField} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import {format} from "date-fns";

import {selectReservationsReport} from "../../../redux/reservation/reservation.selectors";
import {getReservationsReportStart} from "../../../redux/reservation/reservation.actions";
import {BigCenteredContainer} from "../../../components/common-styles/common.styles";

const RestaurantHomePage = ({reservationsReport, getReservationsReport}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => getReservationsReport(selectedDate), [selectedDate, getReservationsReport]);

    const reservationReportListItems = [];
    for (let tableReference in reservationsReport) {
        let tableReservations = []
        for (let reservation of reservationsReport[tableReference].reservations) {
            const reservationListItem =
                <Stack key={tableReservations.length}>
                    <Typography variant='body1'>
                        {`${format(reservation.dateAndTime, 'kk')}:00: ${reservation.customerName} - ${reservation.customerPhone}`}
                    </Typography>
                </Stack>;
            tableReservations.push(reservationListItem);
        }
        reservationReportListItems.push(
            <Grid key={tableReference} item xs>
                <Paper>
                    <Typography variant='h5'>{`Table #${tableReference}`}</Typography>
                    <Divider/>
                    {tableReservations}
                </Paper>
            </Grid>);
    }

    return <BigCenteredContainer>
        <Row>
            <Col>
                <Container maxWidth='sm'>
                    <DatePicker
                        label=""
                        value={selectedDate}
                        onChange={(newValue) => {
                            getReservationsReport(newValue);
                            setSelectedDate(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Container>
            </Col>
        </Row>
        <Row>
            <Col>
                <Grid container spacing={3} alignItems='flex-start' justifyContent='center'>
                    {reservationReportListItems}
                </Grid>
            </Col>
        </Row>
    </BigCenteredContainer>;
};

export default connect(createStructuredSelector({
        reservationsReport: selectReservationsReport
    }),
    dispatch => ({
        getReservationsReport: (date) => dispatch(getReservationsReportStart(date))
    }))(RestaurantHomePage);