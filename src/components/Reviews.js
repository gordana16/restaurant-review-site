import React, { Component } from "react";
import StarRatings from "react-star-ratings";
import Truncate from "react-truncate";

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: []
    };
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(e) {
    const lm = this.state.loadMore.map((isLoadMore, i) => {
      if (i === parseInt(e.target.id)) {
        isLoadMore = !isLoadMore;
      }
      return isLoadMore;
    });
    this.setState({ loadMore: lm });
  }

  componentDidUpdate = prevProps => {
    /*detects which review should be full loaded*/
    let lm = [];
    if (
      lm.length === 0 &&
      prevProps.reviews.length !== this.props.reviews.length
    ) {
      this.props.reviews.forEach(() => lm.push(false));
    }
    if (this.state.loadMore.length === 0 && lm.length !== 0) {
      this.setState({ loadMore: lm });
    }
  };

  render() {
    return (
      <ul
        className="list-group"
        style={{ height: "calc(100% - 56px)", overflow: "auto" }}
      >
        {this.props.reviews.map((review, index) => (
          <li key={review.time} className="list-group-item">
            <h6 className="mb-0">{review.author_name}</h6>
            <StarRatings
              rating={review.rating}
              starRatedColor="orange"
              numberOfStars={5}
              name="rating"
              starDimension="16px"
              starSpacing="1px"
            />
            <p>
              <Truncate
                lines={this.state.loadMore[index] ? -1 : 2}
                ellipsis={
                  <span className="truncate-ellipsis" onClick={this.loadMore}>
                    <button className="btn btn-link" id={index}>
                      more
                    </button>
                  </span>
                }
              >
                {review.text}
              </Truncate>
              {this.state.loadMore[index] ? (
                <span onClick={this.loadMore}>
                  <button className="btn btn-link" id={index}>
                    less
                  </button>
                </span>
              ) : (
                ""
              )}
            </p>
          </li>
        ))}
      </ul>
    );
  }
}

export default Reviews;
