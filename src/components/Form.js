import React, { Component } from "react";
import StarRatings from "react-star-ratings";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 0,
      review: "",
      name: "",
      address: "",
      phone: "",
      website: ""
    };
  }

  resetState() {
    this.setState({
      rating: 0,
      review: "",
      name: "",
      address: "",
      phone: "",
      website: ""
    });
  }

  submitReview = e => {
    // e.preventDefault();
    const review = {
      rating: this.state.rating,
      text: this.state.review,
      user: this.state.name
    };
    if (review.user === "") {
      alert("You must enter at least your name!");
      return;
    }
    this.props.addReview(review);
    this.resetState();
  };

  submitPlace = e => {
    // e.preventDefault();
    const place = {
      name: this.state.name,
      address: this.state.address,
      phone: this.state.phone,
      website: this.state.website
    };
    if (place.name === "" || place.address === "") {
      alert("You must enter at least restaurant name and address!");
      return;
    }
    this.props.addPlace(place);
    this.resetState();
  };

  changeRating = newRating => {
    this.setState({ rating: newRating });
  };

  changeValue = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const showReviewForm = this.props.addReview ? true : false;
    const REVIEW_STYLE = showReviewForm
      ? { display: "block" }
      : { display: "none" };
    const ADD_PLACE_STYLE = !showReviewForm
      ? { display: "block" }
      : { display: "none" };
    const FORM_CONTROL = showReviewForm
      ? "form-control"
      : "form-control-sm h-25 w-100 py-0 mb-0";
    return (
      <form>
        <div className="form-group" style={REVIEW_STYLE}>
          <span>Rate this place: </span>
          <StarRatings
            name="rating"
            starDimension="20px"
            starSpacing="0"
            changeRating={this.changeRating}
            rating={this.state.rating}
            starRatedColor={this.state.rating > 0 ? "orange" : "grey"}
          />
        </div>
        <div className="form-group mt-1 mb-2">
          <input
            type="text"
            name="name"
            className={FORM_CONTROL}
            placeholder="Name"
            value={this.state.name}
            onChange={this.changeValue}
          />
        </div>
        <div className="form-group mt-1 mb-2" style={ADD_PLACE_STYLE}>
          <input
            type="text"
            name="address"
            className={FORM_CONTROL}
            placeholder="Address"
            value={this.state.address}
            onChange={this.changeValue}
          />
        </div>
        <div className="form-group mt-1 mb-2" style={ADD_PLACE_STYLE}>
          <input
            type="text"
            name="phone"
            className={FORM_CONTROL}
            placeholder="Phone Number"
            value={this.state.phone}
            onChange={this.changeValue}
          />
        </div>
        <div className="form-group mt-1 mb-2" style={ADD_PLACE_STYLE}>
          <input
            type="text"
            name="website"
            className={FORM_CONTROL}
            placeholder="Website"
            value={this.state.website}
            onChange={this.changeValue}
          />
        </div>
        <div
          className="form-group"
          style={showReviewForm ? { display: "block" } : { display: "none" }}
        >
          <textarea
            name="review"
            className={FORM_CONTROL}
            rows="5"
            placeholder="Review"
            value={this.state.review}
            onChange={this.changeValue}
          />
        </div>
        <button
          type="button"
          value="Submit"
          className="btn btn-primary btn-sm py-1"
          onClick={showReviewForm ? this.submitReview : this.submitPlace}
        >
          Submit
        </button>
      </form>
    );
  }
}

export default Form;
