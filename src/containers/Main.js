import React, { Component } from "react";
import Header from "../components/Header";
import Map from "../components/Map";
import Places from "../components/Places";

class Main extends Component {
  state = {
    places: [],
    filteredPlaces: [],
    filter: 0,
    sortDirection: ""
  };

  fetchPlaces = places => {
    places.forEach(place => {
      const storedRating = JSON.parse(
        sessionStorage.getItem(`rating_${place.id}`)
      );
      if (storedRating) {
        place.rating = storedRating;
      }
    });

    this.setState(prevState => {
      const newPlaces = [...places, ...prevState.places];
      return {
        places: newPlaces,
        filteredPlaces: newPlaces
      };
    });
  };

  addPlace = place => {
    this.setState(prevState => {
      const newPlaces = [...prevState.places, place];
      return {
        places: newPlaces,
        filteredPlaces: newPlaces
      };
    });
    sessionStorage.setItem(`place_${place.id}`, JSON.stringify(place));
  };

  handleSort = direction => {
    this.setState({ sortDirection: direction });
  };

  onChangeRating = filter => {
    if (this.state.filter === filter) {
      filter = 0;
    }

    this.setState(prevState => ({
      filter: filter,
      filteredPlaces: prevState.places.filter(place => place.rating >= filter)
    }));
  };

  componentDidMount() {
    let places = [];
    const storedData = Object.entries(sessionStorage);
    storedData.forEach(([key, value]) => {
      if (key.startsWith("place")) places.push(JSON.parse(value));
    });
    this.setState({ places: places });
  }

  render() {
    return (
      <div>
        <Header
          brand="Restaurant reviews"
          view="main"
          changeRating={this.onChangeRating}
          filter={this.state.filter}
          sortPlaces={this.handleSort}
          sortDirection={this.state.sortDirection}
        />
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10 map-wrapper">
              <Map
                places={
                  this.state.filteredPlaces.length < this.state.places.length
                    ? this.state.filteredPlaces
                    : this.state.places
                }
                fetchPlaces={this.fetchPlaces}
                addPlace={this.addPlace}
              />
            </div>
            <div className="col-md-2 px-0">
              <Places
                places={
                  this.state.filteredPlaces.length < this.state.places.length
                    ? this.state.filteredPlaces
                    : this.state.places
                }
                sortDirection={this.state.sortDirection}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
