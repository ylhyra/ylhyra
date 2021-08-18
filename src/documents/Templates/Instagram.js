import React from "react";
import Link from "app/Router/Link";
import Audio from "documents/Render/Audio";
import Image from "documents/Templates/Image";
import { getDynamicFileUrl } from "paths";
import Video from "documents/Render/Audio";
export default (props) => {
  return (
    <div className="video-container">
      <div className="video-header">
        <img src={getDynamicFileUrl(props.user_image)} width="40" alt="" />

        <div className="video-author">
          <div className="video-username">
            <a href={props.url}>{props.user_name}</a>
          </div>
          <div className="video-handle">
            <a href={props.url}>@{props.user_handle}</a>
          </div>
        </div>
      </div>
      <div className="video">
        <Video
          type="video"
          src={getDynamicFileUrl(props.file)}
          autoplay="true"
        />
      </div>
      <div className="video-sidebar">
        <div className="video-sidebar-content">
          <div data-translate="true">
            {props.audio && <Audio src={props.audio} label="Slow audio" />}
            {props.children}
          </div>
        </div>
      </div>
    </div>
  );
};
/* {{instagram
  |file=Villi Neto – Kaffi.mp4
  |url=https://www.instagram.com/p/Bu8dSzbAJIs/
  |user_image=VilliNeto.jpg
  |user_name=Villi Neto
  |user_handle=villineto
  |text=
}} */
