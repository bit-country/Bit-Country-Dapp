import React, { useEffect, useRef, useState } from "react";
import AccountBar from ".";
import { Link } from "@reach/router";
import { FormattedMessage } from "react-intl";
import Login from "../../pages/Login/Login";
import Menus from "./Menus";
import { Dropdown, Icon, Menu } from "antd";

export default function PrimaryBar({ promptAccount }) {
  const [ collapsed, setCollapsed ] = useState(false);
  const [ collapsedWidth, setCollapsedWidth ] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    const resizeHandler = () => {
      const rect =
        containerRef.current && containerRef.current.getBoundingClientRect();        
      const parentRect = containerRef.current.parentElement.getBoundingClientRect();

      if (!rect) {
        return;
      }

      if (rect.width > parentRect.width) {
        setCollapsedWidth(rect.width);
        setCollapsed(true);
      } else if (collapsedWidth && parentRect.width > collapsedWidth) {
        setCollapsed(false);
        setCollapsedWidth(null);
      }
    };

    // Call for initial check.
    resizeHandler();

    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [ setCollapsed, collapsedWidth, containerRef ]);

  return (
    <AccountBar drawerContent={promptAccount ? <Login /> : <Menus />}>
      <div
        ref={containerRef}
        className={`primary-menu ${collapsed ? "collapsed" : ""}`}
      >
        {collapsed ? (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <Link className="item" to="/explore">
                    <FormattedMessage id="app.explore" />
                  </Link>
                </Menu.Item>
                <Menu.Item key="marketplace">
                  <Link to="/marketplace">
                    <FormattedMessage id="app.marketplace" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="item" to="/marketplace">
                    <FormattedMessage id="app.marketplace" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="item" to="/my-countries">
                    <FormattedMessage id="app.myCountries" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="item" to="/my-mind">
                    <FormattedMessage id="app.myMind" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="item" to="/wallet/balance">
                    <FormattedMessage id="app.wallet" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link className="item" to="/asset/list">
                    <FormattedMessage id="app.myAssets" />
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <a className="item" href="http://explorer.bit.country/">
                    <FormattedMessage id="app.chainExplorer" />
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <Icon type="menu" />
          </Dropdown>
        ) : (
          <>
            <Link className="item" to="/explore">
              <FormattedMessage id="app.explore" />
            </Link>
            <Link className="item" to="/marketplace">
              <FormattedMessage id="app.marketplace" />
            </Link>
            <Link className="item" to="/my-countries">
              <FormattedMessage id="app.myCountries" />
            </Link>
            <Link className="item" to="/my-mind">
              <FormattedMessage id="app.myMind" />
            </Link>
            <Link className="item" to="/wallet/balance">
              <FormattedMessage id="app.wallet" />
            </Link>
            <Link className="item" to="/asset/list">
              <FormattedMessage id="app.myAssets" />
            </Link>
            <a className="item" href="http://explorer.bit.country/" target="_black" rel="noopener noreferrer">
              <FormattedMessage id="app.chainExplorer" />
            </a>
          </>
        )}
      </div>
    </AccountBar>
  );
}
