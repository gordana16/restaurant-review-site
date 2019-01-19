import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import { Link } from "react-router-dom";

class Places extends Component {
  /*function that specifies sort order in Array.prototype.sort()*/
  sortByRating = (place1, place2) => {
    const desc = this.props.sortDirection === "desc" ? -1 : 1;
    return desc * (place1.rating - place2.rating);
  };

  render() {
    if (this.props.sortDirection !== "") {
      this.props.places.sort(this.sortByRating);
    }

    return (
      <ul
        className="list-group"
        style={{ height: "calc(100vh - 56px)", overflow: "auto" }}
      >
        {this.props.places.map(place => (
          <li key={place.id} className="list-group-item">
            <div>
              <Link
                to={"/" + place.place_id}
                style={{ textDecoration: "none", color: "#000" }}
              >
                {place.name}
              </Link>
            </div>
            <StarRatings
              rating={place.rating}
              starRatedColor="orange"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="5px"
            />
          </li>
        ))}
      </ul>
    );
  }
}

export default Places;
