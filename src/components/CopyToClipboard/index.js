import React, { Component } from "react";
import { Icon, Button } from "antd";
import "./index.css";

export default class CopyToClipboard extends Component {

    copyToClipboard = () =>{
      let input = document.createElement("input");

      input.value = window.location.href;
      document.body.prepend(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }

    render() {
      return (
        <Button className="copy-button" size="small" onClick={this.copyToClipboard}>
          <Icon type="copy" />
        </Button>
      );
    }

}