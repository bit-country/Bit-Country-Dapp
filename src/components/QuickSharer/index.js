import * as React from "react";
import { 
  EmailIcon, 
  EmailShareButton, 
  FacebookIcon, 
  FacebookMessengerIcon, 
  FacebookMessengerShareButton, 
  FacebookShareButton, 
  LineIcon, 
  LineShareButton, 
  LinkedinIcon, 
  LinkedinShareButton, 
  RedditIcon, 
  RedditShareButton, 
  TelegramIcon, 
  TelegramShareButton, 
  TwitterIcon, 
  TwitterShareButton, 
  WhatsappIcon, 
  WhatsappShareButton 
} from "react-share";
import "./index.css";

export default function QuickSharer() {
  const [ url, setUrl ] = React.useState(window.location.href);

  React.useEffect(() => {
    const handleUrlChange = () => {
      setUrl(window.location.href);
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("postopen", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("postopen", handleUrlChange);
    };
  }, []);

  return (
    <div id="quick-sharer">
      <FacebookShareButton url={url}>
        <FacebookIcon size="32" />
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size="32" />
      </TwitterShareButton>
      <RedditShareButton url={url}>
        <RedditIcon size="32" />
      </RedditShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon size="32" />
      </LinkedinShareButton>
      <WhatsappShareButton url={url}>
        <WhatsappIcon size="32" />
      </WhatsappShareButton>
      <FacebookMessengerShareButton url={url}>
        <FacebookMessengerIcon size="32" />
      </FacebookMessengerShareButton>
      <LineShareButton url={url}>
        <LineIcon size="32" />
      </LineShareButton>
      <TelegramShareButton url={url}>
        <TelegramIcon size="32" />
      </TelegramShareButton>
      <EmailShareButton url={url}>
        <EmailIcon size="32" />
      </EmailShareButton>
    </div>
  );
}