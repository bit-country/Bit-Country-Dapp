import React, { useCallback, useState } from "react";
import BCLogoImage from "../../assets/images/BG1png.png";
import { Row, Col } from "antd";
import Status from "../Status";
import { AuthConnect } from "../HOC/Auth/AuthContext";
import "./index.css";
import Menus from "./Menus";
import { Link } from "@reach/router";

function AccountBar({ visible = false, drawerContent, user, sendLogout, children, notificationCount }) {
  const [ showDrawer, setShowDrawer ] = useState(visible);
  const handleToggle = useCallback(() => {
    setShowDrawer(!showDrawer);
  }, [ showDrawer ]);

  const handleItemClick = useCallback(({ target }) => {
    if (target.nodeName == "A" || target.nodeName == "IMG") {
      setShowDrawer(false);
    }
  }, [ showDrawer ]);

  const handleLogout = useCallback(() => {
    setShowDrawer(false);

    sendLogout();
  }, [ showDrawer, sendLogout ]);

  return (
    <nav id="account-bar">
      {showDrawer && (
        <div className="mask" onClick={handleToggle}>        
        </div>
      )}
      <header>
        <div className={`wrapper drawer ${showDrawer ? "active" : "hidden"}`}>
          <div className="container" onClick={handleItemClick}>
            {drawerContent || (
              <Menus />
            )}
          </div>
        </div>
        <Row className="wrapper main">
          <Col className="header-col-left" span={4} onClick={handleItemClick}>
            <span className="bit-logo nav">
              <Link to="/">
                <img src={BCLogoImage} alt="Bit.Country" />
              </Link>
            </span>
          </Col>
          <Col className="header-col-middle" span={16} onClick={handleItemClick}>
            {children}
          </Col>
          <Col className="header-col-right" span={4}>
            <Status 
              user={user} 
              sendLogout={handleLogout}
              toggleDrawer={handleToggle} 
              drawerOpen={showDrawer} 
              notificationCount={notificationCount}
            />
          </Col>
        </Row>
      </header>
    </nav>
  );
}

export default AuthConnect(AccountBar);
