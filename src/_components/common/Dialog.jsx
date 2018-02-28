import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerMetrics } from '../admin/CustomerMetrics'
import { Button, Container, Row, Col } from 'reactstrap';
import {
    Modal, Popover, Tooltip, OverlayTrigger
} from 'react-bootstrap';
import { ApplicationMetrics } from '../user/ApplicationMetrics'
import { EventMetrics } from '../user/EventMetrics'
import '../../assets/css/App.css';

class Dialog extends React.Component {

    constructor() {
        super();

        this.state = {
            modalIsOpen: false
        };

        this.closeModal = this.closeModal.bind(this);
    }


    closeModal() {
        this.props.closeModal();
    }
    render() {
        const popover = (
            <Popover id="modal-popover" title="popover">
                very popover. such engagement
          </Popover>
        );
        const tooltip = <Tooltip id="modal-tooltip">wow.</Tooltip>;
        let eventData = <ApplicationMetrics />
        if (this.props.eventType == "No Route") {
            eventData = <EventMetrics />
        } else if(this.props.eventType == "Route Change") {
            eventData = <EventMetrics />
        }
        return (
            <div>
                <Modal bsSize="large" show={this.props.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton className='bggray'>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                        <EventMetrics />
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button color="danger" className='pull-right' onClick={this.closeModal}>Close</Button>{' '}
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }

}

export { Dialog };