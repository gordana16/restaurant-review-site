import React, { Component } from "react";
//import $ from "jquery";
import "./Photos.css";

// const $ = require("jquery");
const qs = require("querystring");
const url = require("url");
window.$ = window.jQuery;

class Photos extends Component {
  /*without next line carousel is not automatically started*/
  componentDidUpdate() {
    window.$(".carousel").carousel({ interval: 4000 });
  }

  render() {
    let photos = [];
    let indicators = [];
    if (this.props.photos.length === 0) return null;

    this.props.photos
      .map(photo => photo.getUrl({ maxWidth: 1000, maxHeight: 1000 }))
      .forEach((photoSrc, index) => {
        const parsedUrl = url.parse(photoSrc);
        const parsedQuery = qs.parse(parsedUrl.query);
        indicators.push(
          <li
            data-target="#restaurant-carousel"
            data-slide-to={index}
            className={index === 0 ? "active" : ""}
            key={parsedQuery.token + "_" + index}
            style={{
              textIndent: index < 9 ? "11px" : "6px",
              bottom: "-70px",
              margin: "0 4px",
              width: "30px",
              height: "30px",
              borderRadius: "100%",
              backgroundColor: "#999",
              lineHeight: "30px",
              color: "#fff",
              transition: "all 0.25s ease"
            }}
          >
            {index + 1}
          </li>
        );

        photos.push(
          <div
            className={index === 0 ? "carousel-item active" : "carousel-item"}
            key={parsedQuery.token}
          >
            <img
              className="d-block w-100"
              src={photoSrc}
              alt=""
              style={{ height: "350px" }}
            />
          </div>
        );
      });

    return (
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div
            id="restaurant-carousel"
            className="carousel slide mb-3"
            data-ride="carousel"
          >
            <ol className="carousel-indicators">{indicators}</ol>
            <div className="carousel-inner">{photos}</div>
          </div>
          <a
            className="carousel-control-prev"
            href="#restaurant-carousel"
            role="button"
            data-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="sr-only">Previous</span>
          </a>
          <a
            className="carousel-control-next"
            href="#restaurant-carousel"
            role="button"
            data-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="sr-only">Next</span>
          </a>
        </div>
      </div>
    );
  }
}

export default Photos;
