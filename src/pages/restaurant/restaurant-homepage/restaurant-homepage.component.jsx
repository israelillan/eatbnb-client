import React, {useEffect, useState} from 'react';
import {RestaurantPageContainer} from "./restaurant-homepage.styles";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {DatePicker} from "@material-ui/lab";
import {Divider, List, ListItemText, TextField} from "@material-ui/core";

import {selectReservationsReport} from "../../../redux/reservation/reservation.selectors";
import {getReservationsReportStart} from "../../../redux/reservation/reservation.actions";
import {format} from "date-fns";

const RestaurantHomePage = ({reservationsReport, getReservationsReport}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => getReservationsReport(selectedDate), []);

    console.log(reservationsReport);
    const reservationReportListItems = [];
    for (let tableReference in reservationsReport) {
        reservationReportListItems.push(<ListItemText key={tableReference} primary={`Table #${tableReference}`}/>);
        reservationReportListItems.push(<Divider/>);

        let reservationIndex = 0;
        for (let reservation of reservationsReport[tableReference].reservations) {
            const reservationListItem = <List>
                <ListItemText key={reservationIndex}
                              primary={`${format(reservation.dateAndTime, 'kk')}:00: ${reservation.customerName} - ${reservation.customerPhone}`}/>
            </List>;
            reservationReportListItems.push(reservationListItem);
            reservationIndex++;
        }
    }

    console.log(reservationsReport);
    return <RestaurantPageContainer>
        <Link to='/restaurant/tablesLayout'>Edit tables layout</Link>
        <br/>
        <Link to='/restaurant/reservations'>Reservations</Link>
        <br/>
        <br/>
        <DatePicker
            label=""
            value={selectedDate}
            onChange={(newValue) => {
                getReservationsReport(newValue);
                setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
        />
        <br/>
        <List
            sx={{width: '100%'}}
            component="nav"
        >
            {reservationReportListItems}
        </List>
    </RestaurantPageContainer>;
};

export default connect(
    createStructuredSelector({
        reservationsReport: selectReservationsReport
    }),
    dispatch => ({
        getReservationsReport: (date) => dispatch(getReservationsReportStart(date)),
    })
)(RestaurantHomePage);