import React from "react";
import Audio from "documents/render/audio";
import Image from "documents/templates/Image";
import { getDynamicFileUrl } from "paths";
export default (props) => {
  return (
    <div className="tweet">
      <div className="tweet-header">
        {props.user_picture && (
          <img src={getDynamicFileUrl(props.user_picture)} width="50" alt="" />
        )}
        <div className="tweet-author">
          <div className="tweet-username">
            <a href={`https://twitter.com/${props.handle}/status/${props.id}`}>
              {props.user_name}
            </a>
          </div>
          <div className="tweet-handle">
            <a href={`https://twitter.com/${props.handle}/status/${props.id}`}>
              {props.handle}
            </a>
          </div>
        </div>
      </div>
      <div className="tweet-text">
        {props.audio && <Audio src={props.audio} />}
        {props.children}
      </div>
      <div>
        {props.photo1 && (
          <Image src={props.photo1} position={props.photo} width="300" />
        )}
        {props.photo2 && <Image src={props.photo2} width="300" />}
        {props.photo3 && <Image src={props.photo3} width="300" />}
        {props.photo4 && <Image src={props.photo4} width="300" />}
      </div>
    </div>
  );
};
