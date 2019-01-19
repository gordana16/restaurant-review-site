import React, { Component } from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";
import "./Header.css";

class Header extends Component {
  handleSort = e => {
    this.props.sortPlaces(e.target.title);
  };

  render() {
    return (
      <nav
        className={`navbar navbar-expand-md navbar-dark bg-dark pl-2 pr-0 ${
          this.props.view === "main" ? "py-0" : "py-2"
        }`}
      >
        <span className="navbar-brand mb-0 h1">
          {this.props.view === "main" ? (
            this.props.brand
          ) : (
            <Link to="/" style={{ textDecoration: "none", color: "#fff" }}>
              {this.props.brand}
            </Link>
          )}
        </span>

        <nav
          className={`navbar navbar-dark bg-primary ml-md-auto px-md-5 ${
            this.props.view === "main" ? "d-block" : "d-none"
          }`}
        >
          <div className="text-white py-0">Nearby restaurants</div>
          <div className="d-flex">
            <StarRatings
              name="rating"
              starDimension="16px"
              starSpacing="0"
              changeRating={this.props.changeRating}
              rating={this.props.filter}
              starRatedColor="orange"
            />
            <span
              className={`ml-2 mt-1 ${
                this.props.sortDirection === "asc"
                  ? "active-triangle"
                  : "inactive-triangle"
              }`}
              title="asc"
              onClick={this.handleSort}
            >
              &#x25b2;
            </span>
            <span
              className={`ml-2 mt-1 ${
                this.props.sortDirection === "desc"
                  ? "active-triangle"
                  : "inactive-triangle"
              }`}
              title="desc"
              onClick={this.handleSort}
            >
              &#x25bc;
            </span>
          </div>
        </nav>
      </nav>
    );
  }
}

export default Header;
