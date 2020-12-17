/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */

import { Modal } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DimensionNavigation from "../DimensionNavigation/DimensionNavigation";
import { AuthConnect } from "../HOC/Auth/AuthContext";

import { BlockConnect } from "../HOC/Block/BlockWrapper";
import { CountryConnect } from "../HOC/Country/CountryWrapper";
import { DAppConnect } from "../HOC/DApp/DAppWrapper";
import TxButton from "../HOC/DApp/TxButton";
import useSubstrate from "../HOC/DApp/useSubstrate";
import Spinner from "../Spinner";
import Engine from "./Engine";
import "./index.css";



function BitWorldViewer({ blockDetail, country, user, surroundingBlocks }) {
  const { api, keyring, apiState } = useSubstrate();

  const canvasRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);

  const handleDimensionAppClose = useRef(null);

  // Resize canvas
  const updateCanvas = useCallback(canvas => {
    const rect = document
      .getElementById("root")
      .getBoundingClientRect();

    const accountBar = document
      .getElementById("account-bar")
      .getBoundingClientRect();

    canvas.width = rect.width;
    canvas.height = rect.height - accountBar.height;

    canvas.parentElement.height = canvas.height;
  }, []);

  const handleResize = useCallback(() => {
    if (!canvasRef.current) {
      return;
    }

    updateCanvas(canvasRef.current);
  }, [ updateCanvas ]);

  // Allow for resizing canvas and engine.
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Setup dimension viewer after getting reference.
  const bitEngine = useRef(null);

  const handleViewer = useCallback(node => {
    if (node) {
      updateCanvas(node);
      canvasRef.current = node;
    }
  }, []);

  const engineProps = {
    blockDetail,
    country,
    user,
    dimensionAppVisible: modalVisible,
    setDimensionAppVisible: setModalVisible,
    setDimensionAppOnClose: handler =>
      (handleDimensionAppClose.current = handler),
    surroundingBlocks,
    substrate: { api, keyring }
  };

  return (
    <div
      style={{ overflow: "hidden", height: "calc(100vh - var(--bar-height))" }}
    >
      <div
        id="hud-overlay"
        style={{
          position: "fixed",
          top: "calc(var(--bar-height) + 0.5em)",
          width: "20em",
          height: "20em",
          left: "0.5em",
          background: "white",
          zIndex: 100,
        }}
      >
        <DimensionNavigation
          blockDetail={blockDetail}
          surroundingBlocks={surroundingBlocks}
        />
      </div>
      
      <Engine
        refProp={handleViewer}
        {...engineProps}
      />

      <Modal
        visible={modalVisible}
        width="70vw"
        className="smartasset-app-modal"
        onCancel={() => {
          if (handleDimensionAppClose.current) {
            handleDimensionAppClose.current();
          } else {
            setModalVisible(false);
          }
        }}
        footer={null}
      >
        <div id="smartasset-app-root"></div>
      </Modal>
    </div>
  );
}

export default DAppConnect(AuthConnect(CountryConnect(BlockConnect(BitWorldViewer, true))));
