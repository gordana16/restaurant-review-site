/* global google */

import React, { Component } from "react";
import ReactDOM from "react-dom";
import StarRatings from "react-star-ratings";
import Form from "../components/Form";

class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map: null,
      loading: true,
      currentPos: {
        lat: 51.509865,
        lng: -0.118092
      },
      showModal: false,
      currentCoord: {
        x: 0,
        y: 0
      },
      markers: []
    };
  }

  /*add new place by clicking the position on the map */
  addPlace = place => {
    const unique_id = new Date().getTime().toString();
    this.props.addPlace({
      ...place,
      rating: 0,
      id: unique_id,
      place_id: unique_id,
      position: this.state.currentPos
    });
    this.closeAddPlace();
  };

  /*close "add new place" form */
  closeAddPlace = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    /*initialize google map, search for nearby places and create listener for adding new places */
    let map = new google.maps.Map(this.refs.map, {
      center: this.state.currentPos,
      zoom: 17,
      mapTypeId: "roadmap"
    });
    this.setState({ map: map });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        map.setCenter(currentPos);
        this.setState({ loading: false, currentPos });
        const service = new google.maps.places.PlacesService(map);

        new google.maps.Marker({ position: currentPos, map: map });

        service.nearbySearch(
          {
            radius: 5000,
            location: {
              lat: currentPos.lat,
              lng: currentPos.lng
            },
            type: ["restaurant"]
          },
          (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              this.setState({ places: results });
              this.props.fetchPlaces(results);
            }
          }
        );
      });

      //add place
      map.addListener("click", event => {
        let x = 0,
          y = 0;
        //get the relative coordinates of mouse point to the viewport
        for (const key of Object.keys(event)) {
          if (MouseEvent.prototype.isPrototypeOf(event[key])) {
            x = event[key].clientX;
            y = event[key].clientY;
          }
        }
        this.setState({
          showModal: true,
          currentCoord: {
            x: x,
            y: y
          }
        });

        this.setState({
          currentPos: { lat: event.latLng.lat(), lng: event.latLng.lng() }
        });
      });
    } else {
      map.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  /*retrieve position as {lat, lng} for places returned by google api and for manually added places  */
  getPosition = place => {
    const pos = place.geometry
      ? {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      : { lat: place.position.lat, lng: place.position.lng };
    return pos;
  };

  /*update markers on the map, note that the number of created markers is always equal the number of places */
  updateMarkers = places =>
    this.state.markers.filter(m =>
      places.some(p => {
        const pos = this.getPosition(p);
        return pos.lat === m.position.lat() && pos.lng === m.position.lng();
      })
    );

  componentDidUpdate(prevProps, prevState) {
    /*manage creation of markers, hide and show markers in accordance with filtered places*/
    // console.log(prevProps.places.length + " " + this.props.places.length);

    if (prevProps.places.length < this.props.places.length) {
      const newPlaces = this.props.places.filter(
        place => !prevProps.places.includes(place)
      );

      let placesToAdd = newPlaces.filter(
        p =>
          !this.state.markers.some(m => {
            const pos = this.getPosition(p);
            return pos.lat === m.position.lat() && pos.lng === m.position.lng();
          })
      );
      this.createMarkers(placesToAdd, this.state.map);

      const markersToShow = this.updateMarkers(newPlaces);
      for (const marker of markersToShow) {
        marker.setMap(this.state.map);
      }
      this.setBounds(this.props.places);
    } else if (prevProps.places.length > this.props.places.length) {
      const placesToHide = prevProps.places.filter(
        place => !this.props.places.includes(place)
      );
      const markersToHide = this.updateMarkers(placesToHide);
      for (const marker of markersToHide) {
        marker.setMap(null);
      }
    }
  }

  calcFormPosition(x, y, offsetX, offsetY) {
    let coord = { x: 0, y: 0 };
    coord.x = x - offsetX > 0 ? x - offsetX : 0;
    coord.y = y - offsetY > 0 ? y - offsetY : 0;
    return coord;
  }

  render() {
    const offsetX = 300;
    const offsetY = 250;
    const coord = this.calcFormPosition(
      this.state.currentCoord.x,
      this.state.currentCoord.y,
      offsetX,
      offsetY
    );
    const addPlaceForm = (
      <div
        className="card"
        style={{
          width: `${offsetX}px`,
          height: `${offsetY}px`,
          position: "fixed",
          top: coord.y,
          left: coord.x
        }}
      >
        <div className="card-header py-1">
          <button
            type="button"
            className="close"
            onClick={this.closeAddPlace}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <h6 className="mt-2">Add a new restaurant:</h6>
        </div>
        <div className="card-body">
          <Form addPlace={this.addPlace} />
        </div>
      </div>
    );

    return (
      <div>
        <div
          ref="map"
          style={{ width: "100%", height: "calc(100vh - 56px)" }}
        />
        {this.state.showModal && addPlaceForm}
      </div>
    );
  }

  /*create markers on the map */
  createMarkers = (places, map) => {
    let markers = [];
    const infoWindow = new google.maps.InfoWindow({
      content: ""
    });
    for (const place of places) {
      const smallIcon = this.getIcon(place.rating, true);
      const bigIcon = this.getIcon(place.rating, false);

      const markerPosition = place.geometry
        ? place.geometry.location
        : place.position;
      const marker = new google.maps.Marker({
        icon: smallIcon,
        title: place.name,
        position: markerPosition
      });
      marker.addListener("click", () => {
        const starsDiv = document.createElement("div");

        ReactDOM.render(
          <StarRatings
            rating={place.rating}
            starRatedColor="orange"
            numberOfStars={5}
            name="rating"
            starDimension="12px"
            starSpacing="1px"
          />,
          starsDiv
        );
        const renderStars = starsDiv.innerHTML;

        let img = place.geometry
          ? `<img src= "https://maps.googleapis.com/maps/api/streetview?size=180x100&location=${place.geometry.location.lat()},${place.geometry.location.lng()}&fov=90&heading=235&pitch=10&key=AIzaSyCgURx8CJ4iv_GN20xPz3Iall7r4pqwpmU"/>`
          : `<img src= ${bigIcon} />`;
        let iwHeight = place.geometry ? "170px" : "130px";
        infoWindow.open(map, marker);
        infoWindow.setContent(
          `<div style="height: ${iwHeight}; text-align: center">
          <div>
         ${img}
          </div>
          <div>
          ${renderStars}
          </div>         
          <h6 class="mb-0">${place.name}</h6>
          <p class="mb-0">${
            place.vicinity ? place.vicinity : place.address
          }</p>                 
          <a href="/${place.place_id}">More info</a>
         </div>`
        );
      });
      markers.push(marker);
    }
    for (const marker of markers) {
      marker.setMap(map);
    }
    this.setState(prevState => ({
      markers: [...prevState.markers, ...markers]
    }));
  };

  setBounds(places) {
    const bounds = new google.maps.LatLngBounds();
    for (const place of places) {
      bounds.extend(place.geometry ? place.geometry.location : place.position);
    }
    this.state.map.fitBounds(bounds);
  }

  getIcon(rating, small) {
    if (rating < 3) {
      return small ? "img/place_small_3.png" : "img/place_big_3.png";
    } else if (rating > 4) {
      return small ? "img/place_small_1.png" : "img/place_big_1.png";
    }
    return small ? "img/place_small_2.png" : "img/place_big_2.png";
  }
}

export default Map;
