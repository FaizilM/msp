import React from 'react';
import ReactDOM from 'react-dom';
import ReactModal from 'react-modal';
import { CustomerMetrics } from '../admin/CustomerMetrics'
import { Button, Container, Row, Col } from 'reactstrap';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};


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
        return (
            <div>
                <ReactModal
                    isOpen={this.props.isOpen}
                    
                    shouldCloseOnEsc={true}
                    contentLabel="Minimal Modal Example"
                    style={{ overlay: {}, content: {top:'75px'} }}
                >
                <Row>
                <CustomerMetrics />
                </Row>
                <Row>
                <Button color="danger" className="pull-right" onClick={this.closeModal}>Close</Button>{' '}
                </Row>
                
                </ReactModal>
            </div>
        );
    }
}

export { Dialog };