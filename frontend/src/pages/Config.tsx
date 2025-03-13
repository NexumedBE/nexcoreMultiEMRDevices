import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import logo from '../assets/nexumedLogo.png';
// import CDM1 from '../assets/CDM1.png';
// import CDM2 from '../assets/CDM2.png';
// import CDM3 from '../assets/CDM3.png';
// import CDM4 from '../assets/CDM4.png';
import '../App.css';

const Config: React.FC = () => {
  // Define options for the dropdowns
  const deviceCompanies = ['MESI', 'MENDY', 'ABC', 'DEF', 'HIJ'].sort();
  const emrProviders = ['CareConnect', 'Sanday', 'Cerner', 'Emdeon', 'Athenahealth'].sort();

  // State for selected options
  const [deviceCompany, setDeviceCompany] = useState('');
  const [emrProvider, setEmrProvider] = useState('');

  // State for modal visibility
  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = () => {
    setShowModal(true); // Show the modal when the button is clicked
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the modal
  };

  return (
    <div>
      <p className="nexSubTitle">Connect Your Medical Worlds With Nexumed</p>
      <div className="center_wanted">
        <img className="nexLogo" src={logo} alt="Nexumed Logo" />
      </div>
      <div>
        <Row>
          <Col sm={6}>
            <p className="dropDownTitle">Device Company</p>
            <div className="center_wanted">
              <select
                value={deviceCompany}
                onChange={(e) => setDeviceCompany(e.target.value)}
                className="form-select"
              >
                <option value="" disabled>
                  Select Device Company
                </option>
                {deviceCompanies.map((company, index) => (
                  <option key={index} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            {deviceCompany != '' ?
              <div className="divInstructions">
                <div>
                  <p className="SelectedChoice">{deviceCompany}</p>
                </div>
                {/* <div>
                  <p>Install instructions</p>
                </div> */}
                {/* <div className="center_wanted">
                  <Row>
                    <Col sm={3}>
                      <img src={CDM2} alt="first" width={100} height={100} className="cdmImage"/>
                    </Col>
                    <Col sm={3}>
                      <img src={CDM1} alt="first" width={100} height={100} className="cdmImage"/>
                    </Col>
                    <Col sm={3}>
                      <img src={CDM3} alt="first" width={100} height={100} className="cdmImage"/>
                    </Col>
                    <Col sm={3}>
                      <img src={CDM4} alt="first" width={100} height={100} className="cdmImage"/>
                    </Col>
                  </Row>
                </div> */}
              </div>
              : <div></div>
            }
          </Col>
          <Col sm={6}>
            <p className="dropDownTitle">EMR Provider</p>
            <div className="center_wanted">
              <select
                value={emrProvider}
                onChange={(e) => setEmrProvider(e.target.value)}
                className="form-select"
              >
                <option value="" disabled>
                  Select EMR Provider
                </option>
                {emrProviders.map((provider, index) => (
                  <option key={index} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>
            </div>
            {emrProvider != '' ?
              <div>
                <div>
                  <p className="SelectedChoice">{emrProvider}</p>
                </div>
                {/* <div>
                  <p>Install instructions</p>
                </div> */}
              </div>
              : <div></div>
            }
          </Col>
        </Row>
      </div>
      <div className="center_wanted">
        <button className="nexButton" onClick={handleConnectClick}>
          Connect Your Worlds
        </button>
      </div>
      <div className="center_wanted">
        <div>
          <Modal show={showModal} onHide={handleCloseModal} className="connectedModal">
            <div className="center_wanted">
              <Modal.Header>
                <Modal.Title>CONNECTED: </Modal.Title>
              </Modal.Header>
            </div>
            {/* <div className="center_wanted"> */}
              <Modal.Body className="pSuccessConn">Your worlds have been successfully connected!</Modal.Body>
              {/* <Modal.Footer>
              </Modal.Footer> */}
            {/* </div> */}
            <div className="center_wanted">
              <Button onClick={handleCloseModal} className="connectionBtnClose">
                Close
              </Button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Config;
