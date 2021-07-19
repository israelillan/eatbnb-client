import React, {useState} from 'react';
import {connect} from "react-redux";
import {Col, Row} from "react-bootstrap";
import {
    Button,
    ButtonGroup,
    ClickAwayListener,
    Container,
    Divider,
    Grow,
    ListItemButton,
    ListItemIcon,
    MenuItem,
    MenuList,
    Paper,
    Popper
} from "@material-ui/core";
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import {FixedSizeList} from 'react-window';
import {format} from 'date-fns';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

import ReservationsForTableCreate from "../reservations-for-table-create/reservations-for-table-create.component";
import {createStructuredSelector} from "reselect";
import {selectReservations, selectThereAreMoreReservations} from "../../../redux/reservation/reservation.selectors";
import ReservationForTableViewer from "../reservation-for-table-viewer/reservation-for-table-viewer.component";
import {
    deleteReservationStart,
    getReservationsStart,
    updateReservationStart
} from "../../../redux/reservation/reservation.actions";
import {BigCenteredContainer} from "../../common-styles/common.styles";

const ReservationsForTable = ({
                                  table, reservations, thereAreMoreReservations,
                                  doGetReservations, doUpdateReservation, doDeleteReservation
                              }) => {
    const [reservationBeingEdited, setReservationBeingEdited] = useState(null);

    const reservationClicked = (reservation) => {
        setReservationBeingEdited(reservation);
    };
    const updateReservation = (reservation) => {
        doUpdateReservation(reservation,
            reservationBeingEdited.table,
            reservationBeingEdited.dateAndTime,
            reservationBeingEdited.customerName,
            reservationBeingEdited.customerPhone);
        setReservationBeingEdited(null);
    };

    const renderRow = ({index, style}) => {
        if (index < reservations.length) {
            const reservation = reservations[index];
            return (
                <ListItem style={style} key={reservation.backendObject.id} alignItems='flex-start'>
                    <ListItemButton onClick={() => reservationClicked(reservation)}>
                        <ListItemText
                            primary={`${format(reservation.dateAndTime, 'dd/MM/yyyy kk:mm:ss')}`}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {`${reservation.customerName}`}
                                    </Typography>
                                    {` - ${reservation.customerPhone}`}
                                </React.Fragment>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            );
        } else {
            return (
                <ListItem style={style} key={'MORE'} alignItems='flex-start'>
                    <ListItemButton onClick={() => doGetReservations(table)}>
                        <ListItemIcon>
                            <CloudDownloadIcon/>
                        </ListItemIcon>
                        <ListItemText
                            primary={`Load more`}
                        />
                    </ListItemButton>
                </ListItem>
            );
        }
    };

    const filterOptions = [
        {buttonTitle: 'See all reservations', sort: 'dateAndTime', query: undefined},
        {
            buttonTitle: 'See future reservations',
            sort: 'dateAndTime',
            query: (q) => q.greaterThan('dateAndTime', new Date())
        },
        {
            buttonTitle: 'See past reservations',
            sort: '-dateAndTime',
            query: (q) => q.lessThan('dateAndTime', new Date())
        }
    ];

    const [openFilterOptions, setOpenFilterOptions] = React.useState(false);
    const filterOptionsAnchorRef = React.useRef(null);
    const [selectedFilterIndex, setSelectedFilterIndex] = React.useState(0);

    return <BigCenteredContainer>
        <Row>
            <Col>
                <Typography variant='h5'
                            align='center'>{`Reservations for table #${table.reference} [${table.seats}]`}</Typography>
            </Col>
            <Col className='justify-content-end'>
                <ReservationsForTableCreate table={table}/>
                <span> </span>
                <ButtonGroup variant="contained" ref={filterOptionsAnchorRef}>
                    <Button onClick={() => {
                        setOpenFilterOptions((prevOpen) => !prevOpen);
                    }}>{filterOptions[selectedFilterIndex].buttonTitle}</Button>
                    <Button
                        size="small"
                        aria-controls={openFilterOptions ? 'split-button-menu' : undefined}
                        aria-expanded={openFilterOptions ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={() => {
                            setOpenFilterOptions((prevOpen) => !prevOpen);
                        }}
                    >
                        <ArrowDropDownIcon/>
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
        <Row>
            <Col>
                <Divider/>
            </Col>
        </Row>
        <Row>
            <Col>
                <Container maxWidth='sm'>
                    <FixedSizeList
                        height={400}
                        width={'100%'}
                        itemSize={80}
                        itemCount={reservations.length + (thereAreMoreReservations ? 1 : 0)}
                        overscanCount={5}
                    >
                        {renderRow}
                    </FixedSizeList>
                </Container>
            </Col>
        </Row>
        <ReservationForTableViewer
            reservation={reservationBeingEdited}
            setReservationDetails={setReservationBeingEdited}
            onHide={() => {
                setReservationBeingEdited(null)
            }}
            onAccept={updateReservation}
            onDelete={(r) => {
                doDeleteReservation(r);
                setReservationBeingEdited(null);
            }}
        />
        <Popper open={openFilterOptions} anchorEl={filterOptionsAnchorRef.current} role={undefined} transition
                disablePortal>
            {({TransitionProps, placement}) => (
                <Grow
                    {...TransitionProps}
                    style={{
                        transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                        <ClickAwayListener onClickAway={(event) => {
                            if (filterOptionsAnchorRef.current && filterOptionsAnchorRef.current.contains(event.target)) {
                                return;
                            }

                            setOpenFilterOptions(false);
                        }}>
                            <MenuList id="split-button-menu">
                                {filterOptions.map((option, index) => (
                                    <MenuItem
                                        key={option.buttonTitle}
                                        selected={index === selectedFilterIndex}
                                        onClick={() => {
                                            const selectedFilter = filterOptions[index];
                                            doGetReservations(table, selectedFilter.sort, selectedFilter.query);
                                            setSelectedFilterIndex(index);
                                            setOpenFilterOptions(false);
                                        }}
                                    >
                                        {option.buttonTitle}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>
                </Grow>
            )}
        </Popper>
    </BigCenteredContainer>;
};

export default connect(
    createStructuredSelector({
        reservations: selectReservations,
        thereAreMoreReservations: selectThereAreMoreReservations
    }),
    dispatch => ({
        doGetReservations: (table, sort = undefined, query = null) => dispatch(getReservationsStart(table, sort, query)),
        doUpdateReservation: (reservation, table, dateAndTime, customerName, customerPhone) => dispatch(updateReservationStart(reservation, table, dateAndTime, customerName, customerPhone)),
        doDeleteReservation: (reservation) => dispatch(deleteReservationStart(reservation))
    }))
(ReservationsForTable);
