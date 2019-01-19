/* global google */

import React, { Component } from "react";
import Header from "../components/Header";
import Reviews from "../components/Reviews";
import Photos from "../components/Photos.js";
import Form from "../components/Form";
import StarRatings from "react-star-ratings";

class Place extends Component {
  state = {
    name: "",
    address: "",
    phone: "",
    website: "",
    rating: 0,
    reviews: [],
    photos: []
  };

  componentDidMount = () => {
    let map = new google.maps.Map(this.refs.map, {
      center: this.state.mapCenter,
      zoom: 13,
      mapTypeId: "roadmap"
    });

    let service = new google.maps.places.PlacesService(map);
    //get places details
    service.getDetails(
      { placeId: this.props.match.params.place_id },
      (place, status) => {
        //for places returned by google api
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          const storedReviews = this.getReviews(place.id);
          const currentReviews = place.reviews ? place.reviews : [];
          const reviews = storedReviews.length
            ? [...currentReviews, ...storedReviews]
            : currentReviews;
          const rating = storedReviews.length
            ? this.getRating(reviews)
            : place.rating;
          this.setState({
            name: place.name ? place.name : "",
            address: place.vicinity ? place.vicinity : "",
            phone: place.formatted_phone_number
              ? place.formatted_phone_number
              : "",
            rating: rating,
            reviews: reviews,
            photos: place.photos ? place.photos : [],
            website: place.website ? place.website : "",
            id: place.id ? place.id : ""
          });
        } else {
          //retrieves manually added places from session storage
          let storedPlaces = Object.values(sessionStorage);
          if (storedPlaces) {
            const places = storedPlaces.map(place => JSON.parse(place));
            for (place of places) {
              if (this.props.match.params.place_id === place.place_id) {
                this.setState({
                  name: place.name ? place.name : "",
                  address: place.address ? place.address : "",
                  phone: place.phone ? place.phone : "",
                  photos: place.photos ? place.photos : [],
                  website: place.website ? place.website : "",
                  rating: place.rating ? place.rating : 0,
                  reviews: place.reviews ? place.reviews : [],
                  id: place.id ? place.id : "",
                  place_id: place.place_id ? place.place_id : "",
                  position: place.position ? place.position : []
                });
              }
            }
          }
        }
      }
    );
  };

  getReviews(id) {
    const storedReviews = JSON.parse(sessionStorage.getItem(`review_${id}`));
    return storedReviews ? storedReviews : [];
  }

  getRating(reviews) {
    const ratings = reviews.map(review => review.rating);
    const rating =
      ratings.reduce((sum, rating) => sum + rating, 0) / reviews.length;
    return rating % 10 ? parseFloat(rating.toFixed(1)) : rating;
  }
  addReview = review => {
    const place = this.state;

    const newReview = {
      time: new Date().getTime(),
      author_name: review.user,
      text: review.text,
      rating: review.rating
    };
    place.reviews.push(newReview);
    place.rating = this.getRating(place.reviews);
    this.setState(place);
    if (sessionStorage.getItem(`place_${place.place_id}`)) {
      sessionStorage.setItem(`place_${this.state.id}`, JSON.stringify(place));
    } else {
      const storedReviews = this.getReviews(place.id);
      const newStoredReviews = storedReviews
        ? [...storedReviews, newReview]
        : [newReview];

      sessionStorage.setItem(
        `review_${this.state.id}`,
        JSON.stringify(newStoredReviews)
      );
      sessionStorage.setItem(`rating_${this.state.id}`, place.rating);
    }
  };

  render() {
    const place = this.state;
    return (
      <div>
        <Header brand="Restaurant reviews" view="review" />

        <div className="container-fluid">
          <div ref="map" />
          <div className="row">
            <div className="col-md-9 mb-3">
              <div className="d-md-flex mt-5">
                <h3 className="mr-3">{place.name}</h3>
                <StarRatings
                  rating={place.rating}
                  starRatedColor="orange"
                  numberOfStars={5}
                  name="rating"
                  starDimension="16px"
                  starSpacing="1px"
                />
              </div>
              <span>
                <p className="mb-2">
                  <i>{place.address}</i>
                </p>
                <p className="mb-2">
                  <i> Phone: {place.phone}</i>
                </p>
                <p
                  style={
                    place.website === ""
                      ? { display: "none" }
                      : { display: "block" }
                  }
                >
                  <a href={place.website}>
                    <i>Visit Restaurant Website</i>
                  </a>
                </p>
              </span>
              <Photos photos={this.state.photos} />
              <div className="add-review mt-5">
                <h5>Leave a review:</h5>
                <Form addReview={this.addReview} />
              </div>
            </div>
            <div className="col-md-3 px-0">
              <Reviews reviews={this.state.reviews} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Place;
