import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useSearchParams } from "react-router-dom";
import { IResultObj } from "../../Interfaces/Interfaces";
import "./map.css";

const ResultsPage = () => {
  const [tripProps, setTripProps] = useState<IResultObj>();
  const [directionsResponse, setDirectionsResponse] = useState<any>(null);
  const [distance, setDistance] = useState<any>();

  const [search] = useSearchParams();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAHNyZoDCvjwtvM31xIRn1mWG6ma2KQvDE",
    libraries: ["places"],
  });

  useEffect(() => {
    handleSetParams();
  }, []);

  useEffect(() => {
    if (tripProps && isLoaded) {
      handleCalculate();
    }
  }, [tripProps, isLoaded]);

  const handleSetParams = () => {
    let obj = Object.fromEntries(search);
    obj.city_of_origin = JSON.parse(obj.city_of_origin);
    obj.city_of_destination = JSON.parse(obj.city_of_destination);
    obj.waypoints_city = JSON.parse(obj.waypoints_string);
    // @ts-ignore
    obj.waypoints_city = obj.waypoints_city.map((waypoint: string) =>
      JSON.parse(waypoint)
    );
    obj.number_of_people = JSON.parse(obj.number_of_people);
    // @ts-ignore
    setTripProps(obj);
  };

  const getAveragePosition = () => {
    let originCity = {
      lat: parseInt(tripProps?.city_of_origin?.latitude as string),
      lng: parseInt(tripProps?.city_of_origin?.longitude as string),
    };
    let destCity = {
      lat: parseInt(tripProps?.city_of_destination?.latitude as string),
      lng: parseInt(tripProps?.city_of_destination?.longitude as string),
    };

    let average = {
      lat: (originCity.lat + destCity.lat) / 2,
      lng: (destCity.lng + destCity.lng) / 2,
    };
    return average;
  };

  const handleCalculate = async () => {
    const directionsService = new google.maps.DirectionsService();
    const result = await directionsService.route({
      origin: {
        lat: parseInt(tripProps?.city_of_origin?.latitude as string),
        lng: parseInt(tripProps?.city_of_origin?.longitude as string),
      },
      destination: {
        lat: parseInt(tripProps?.city_of_destination?.latitude as string),
        lng: parseInt(tripProps?.city_of_destination?.longitude as string),
      },
      waypoints: tripProps?.waypoints_city.map((waypt) => {
        let stop = new google.maps.LatLng(
          parseInt(waypt.latitude),
          parseInt(waypt.longitude)
        );
        return {
          location: stop,
          stopover: true,
        };
      }),
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING,
    });

    setDirectionsResponse(result);
    computeTotalDistance(result);
  };

  function computeTotalDistance(result: any) {
    var totalDist = 0;
    var myroute = result.routes[0];
    for (let i = 0; i < myroute.legs.length; i++) {
      totalDist += myroute.legs[i].distance.value;
    }
    totalDist = totalDist / 1000;
    setDistance(totalDist);
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        <GoogleMap
          center={getAveragePosition()}
          zoom={5}
          mapContainerStyle={{
            width: "600px",
            height: "600px",
            marginTop: "50px",
          }}
        >
          <Marker
            position={{
              lat: parseInt(tripProps?.city_of_origin?.latitude as string),
              lng: parseInt(tripProps?.city_of_origin?.longitude as string),
            }}
          />
          <Marker
            position={{
              lat: parseInt(tripProps?.city_of_destination?.latitude as string),
              lng: parseInt(
                tripProps?.city_of_destination?.longitude as string
              ),
            }}
          />
          {tripProps?.waypoints_city.map((point, index) => (
            <Marker
              key={index}
              position={{
                lat: parseInt(point.latitude),
                lng: parseInt(point.longitude),
              }}
            />
          ))}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
        <div>Total Distance: {distance} Km</div>
      </Container>
    </React.Fragment>
  );
};

export default ResultsPage;
