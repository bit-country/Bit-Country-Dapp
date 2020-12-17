/* eslint-disable no-unused-vars */
import { AdvancedDynamicTexture, Container, Control, TextBlock } from "@babylonjs/gui";

export default function SetupHUD(scene) {
  let HUD = AdvancedDynamicTexture.CreateFullscreenUI("HUD", true, scene);
  
  let locationContainer = new Container("location");

  locationContainer.background = "white";
  locationContainer.alpha = 0.8;
  locationContainer.width = "200px";
  locationContainer.height = "50px";
  locationContainer.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
  
  const location = "Loading...";

  let locationText = new TextBlock("location-text", location);

  locationContainer.addControl(locationText);

  let actionContainer = null;
  let actionText = null;

  let messageContainer = null;
  let messageText = null;
  let messageTimeoutHandler = null;

  HUD.addControl(locationContainer);

  const hideAction = () => {
    if (!actionContainer) {
      return;
    }
    
    HUD.removeControl(actionContainer);
    actionText.dispose();
    actionContainer.dispose();
  };

  return {
    updateLocation: location => {
      locationText.text = location;
    },
    showTimedMessage: message => {
      const {
        text, 
        duration, 
        fontSize = 20, 
        fontWeight = 300,
        fontColour = "white"
      } = message;

      if (messageContainer) {
        window.clearTimeout(messageTimeoutHandler);
        
        HUD.removeControl(messageContainer); 
        messageContainer.dispose(); 
        messageText.dispose();
      }

      messageContainer = new Container("MessageContainer");

      messageContainer.background = "transparent";
      messageContainer.width = "500px";
      messageContainer.height = "100px";
      messageContainer.top = "-25%";

      messageText = new TextBlock("Message-Text", text);
      messageText.color = fontColour;
      messageText.fontSize = fontSize;
      messageText.fontWeight = fontWeight;
      messageText.outlineColor = "black";
      messageText.outlineWidth = 4;

      messageContainer.addControl(messageText);

      HUD.addControl(messageContainer);

      messageTimeoutHandler = window.setTimeout(() => { HUD.removeControl(messageContainer); messageContainer.dispose(); messageText.dispose(); }, duration);
    },
    showAction: message => {
      const {
        text,
        fontSize = 20,
        fontWeight = 300,
        fontColour = "white"
      } = message;

      if (actionContainer) {
        hideAction();
      }

      actionContainer = new Container("ActionContainer");

      actionContainer.background = "transparent";
      actionContainer.width = "500px";
      actionContainer.height = "100px";
      actionContainer.top = "10%";

      actionText = new TextBlock("Action-Text", text);
      actionText.color = fontColour;
      actionText.fontSize = fontSize;
      actionText.fontWeight = fontWeight;
      actionText.outlineColor = "black";
      actionText.outlineWidth = 4;

      actionContainer.addControl(actionText);

      HUD.addControl(actionContainer);
    },
    hideAction
  };
}
