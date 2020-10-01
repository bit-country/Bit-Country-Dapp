import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Avatar,
  Dropdown,
  Menu,
  Icon,
  Badge
} from "antd";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";
import "./index.css";

export default function Status({ user, sendLogout, drawerOpen, toggleDrawer, notificationCount, clearNotificationCount }) {
  const [ collapsed, setCollapsed ] = useState(false);
  const containerRef = useRef();

  const userAvatar = user?.profileImageUrl ? (
    <Avatar
      shape="square"
      size="small"
      src={user.profileImageUrl}
      alt={user.nickName}
    />
  ) : (
    <Avatar
      shape="square"
      size="small"
      icon="user"
      alt="Default profile picture"
    />
  );

  useEffect(() => {
    const resizeHandler = () => {
      const rect =
        containerRef.current && containerRef.current.getBoundingClientRect();

      if (!rect) {
        return;
      }

      if (rect.width < 255) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Call for initial check.
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ setCollapsed, containerRef ]);

  const dropdownMenu = useMemo(() => (
    <Menu className="status-dropdown">
      {user ? (
        <>
          <Link
            to="/notifications"
            onClick={clearNotificationCount}
          >
            <div className="notifications">
              <FormattedMessage 
                key={notificationCount}
                id="app.notifications" 
                values={{ count: notificationCount }}
              />
            </div>
          </Link>
          <Link
            to="/profile"
          >
            <Menu.Item 
              key="Profile"
            >
              <span className="name">
                {user.nickName}
              </span>
            </Menu.Item>
          </Link>
          <Menu.Item key="Logout" onClick={sendLogout}>
            <Icon type="logout" /> <FormattedMessage id="app.logout" />
          </Menu.Item>
        </>
      ) : (
        <Link to="/login">
          <Menu.Item key="Profile">
            <span className="login">
              <FormattedMessage id="app.login" />
            </span>
          </Menu.Item>
        </Link>
      )}
    </Menu>
  ), [ user, notificationCount ]);

  return collapsed ? (
    <div className="navigation collapsed" ref={containerRef}>
      <div className={"profile" + (user ? " hint" : "")}>
        {user ? (
          <Badge dot count={notificationCount}>
            <Dropdown
              overlay={dropdownMenu}
              trigger={[ "click" ]}
              placement="bottomRight"
              overlayClassName="status overlay-container"
            >
              {userAvatar}
            </Dropdown>
          </Badge>
        ) : (
          <Link className="nav-btn nav-btn-login" to="/login" >
            <Icon type="login" />
          </Link>
        )}
      </div>
      <div className="separator" />
      <div className="nav-btn">
        <a>
          <Icon
            type={drawerOpen ? "up" : "down"}
            onClick={toggleDrawer}
          />
        </a>
      </div>
    </div>
  ) : (
    <div className="navigation" ref={containerRef} >
      {user ? (
        <>
          <Link
            to="/notifications"
            onClick={clearNotificationCount}

          >
            <div className="notifications">
              <Badge dot count={notificationCount}>
                <Icon type="bell" />
              </Badge>
            </div>
          </Link>
          <Link
            to="/profile"
          >
            <div className="profile">
              {userAvatar}
              <span className="name">{user.nickName}</span>
            </div>
          </Link>
          <a className="nav-btn" onClick={sendLogout}>
            <Icon type="logout" />
          </a> 
          {/* <a className="nav-btn nav-btn-friend is-active" href="#" /> */}
          {/* <a
            className="nav-btn nav-btn-notification is-active"
            href="#"
          /> */}
        </>
      ) : (
        <>
          <Link className="nav-btn nav-btn-login" to="/login" >
            <Icon type="login" />
          </Link>
        </>
      )}
      <div className="separator" />
      <div className="nav-btn">
        <a>
          <Icon
            type={drawerOpen ? "up" : "down"}
            onClick={toggleDrawer}
          />
        </a>
      </div>
    </div>
  );
}
