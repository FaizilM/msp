import React from 'react';
import ReactDOM from 'react-dom';
import { CustomerMetrics } from '../admin/CustomerMetrics'
import { Button, Container, Row, Col } from 'reactstrap';
import {
    Modal, Popover, Tooltip, OverlayTrigger
} from 'react-bootstrap';
import { ApplicationMetrics } from '../user/ApplicationMetrics'

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

        return (
            <div>
                <Modal bsSize="large" show={this.props.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                        <ApplicationMetrics />
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