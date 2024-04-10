import React from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/modal";

export default function Modals(props) {
  let show = props.show;
  let onHide = props.onHide;
  let onAction1 = props.onAction1;
  let title = props.title;
  let body = props.body;
  let buttonText1 = props.buttonText1;
  let buttonText2 = props.buttonText2;
  let error = props.error;
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body === undefined ? null : <div>{body}</div>}</Modal.Body>
      <Modal.Footer>
        {buttonText2 === undefined ? null : (
          <Button variant="primary" onClick={onAction1} disabled={error}>
            {buttonText2}
          </Button>
        )}
        {buttonText1 === undefined ? null : (
          <Button variant="primary" onClick={onHide}>
            {buttonText1}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
