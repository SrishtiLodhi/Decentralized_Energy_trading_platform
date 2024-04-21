import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../../css/profile_css/Modal.css";
import { useAuth } from "../../contexts/AuthContext"
import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

import { abi, contractAddress } from "../../contexts/constants"

const {REACT_APP_CP_KEY, REACT_APP_WALLET, REACT_APP_ADMIN_WALLET} = process.env

function BidModal(props) {

  const { currentUser} = useAuth()

  const PK = `${REACT_APP_CP_KEY}`; // channel private key
  const Pkey = `0x${PK}`;
  const signer = new ethers.Wallet("21d5ad9c6710b90d57dcf3c6fad1cdce6e695280f2d273404c50f0398cea7937");

  const API_BASE = "https://powerx-backend.onrender.com";

  const [energy, setEnergy] = useState();
  const [price, setPrice] = useState();
  const [date, setDate] = useState();

  const [isFetching, setIsFetching] = useState(false);

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => {
    setShowError(false);
    props.setModalShow(false)
  }

  // console.log("inside bid modal")

  async function send() {
    console.log(`Sending...`)
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.sendViaCall(`${REACT_APP_ADMIN_WALLET}`, 1000000, {value: ethers.utils.parseEther('0.000000000001')})
        // await listenForTransactionMine(transactionResponse, provider)
        await transactionResponse.wait(1)

      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("install metamask first!!")
    }
  }

  const sendNotification = async() => {
    try {
      const apiResponse = await PushAPI.payloads.sendNotification({
        signer,
        type: 1, // target
        identityType: 2, // direct payload
        notification: {
          title: `New entry was created!`,
          body: `Energy available: ${energy} KWh;
                 Unit Price: ${price} MATIC;
                 Created By: ${currentUser.walletid};`
        },
        payload: {
          title: `New entry was created!`,
          body: `Energy available: ${energy} KWh;
                 Unit Price: ${price} MATIC;
                 Created By: ${currentUser.walletid};`,
          cta: '',
          img: ''
        },
        channel: `eip155:5:0x0eA21a0e301A0296F39426cD0433b93AAD31cE3a`, // your channel address
        env: 'staging'
      });
      
      // apiResponse?.status === 204, if sent successfully!
      // console.log('API repsonse: ', apiResponse);
    } catch (err) {
      console.error('Error: ', err);
    }
  }
  
  async function handleClick(e) {
    setIsFetching(true);
    e.preventDefault()

    if(true){

        // console.log(".............")
      try {
  //

        await send()
        await sendNotification();

        await fetch(API_BASE + '/auctions', {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              quantity: energy,
              price: price,
              expiry: new Date(date).getTime()
          })
        }).then(res => res.json())
  
        setShowError(true)
        setErrorMessage("Successfully created auction")
  
  
      } catch {
        setShowError(true)
        setErrorMessage("Failed creating auction")
      }
      finally{
        setIsFetching(false);
      }

    }
    else{
      // setShowError(true)
      // setErrorMessage("Unit Price out of range!")
      // setIsFetching(false);
    }


  }

    return (

      <>
      
      <Modal show={showError} onHide={handleClose} id="error-modal">
        <Modal.Header closeButton>
          <Modal.Title>{errorMessage}</Modal.Title>
        </Modal.Header>
      </Modal>

      <Modal
        show={props.show}
        onHide={() => props.setModalShow(false)}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Host Auction
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>Unit Price must be between 0.00001 ETH and 0.0001 ETH</div>
            <div className="input_p">
                <input type="number" placeholder="Amount of energy" className="input_box_p" required value={energy} onChange={(e) => setEnergy(e.target.value)}/>
                <input type="number" placeholder="Set Price in ETH" className="input_box_p" required value={price} onChange={(e) => setPrice(e.target.value)}/>
                <input type="datetime-local" className="input_box_p" required value={date} onChange={(e) => setDate(e.target.value)}/>
            </div>
            <br/>
            <div className="inpBtn_p">
                <button className="model-btn_p" onClick={handleClick} disabled={isFetching}>
                  {!isFetching && 
                      <>Create Auction</>
                  }
                  {isFetching && 
                      <>Hosting...</>
                  }
                </button>
            </div>

        </Modal.Body>
      </Modal>
      </>

    );
}

export default BidModal;