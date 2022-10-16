import React, { useState, useEffect } from "react";
import { Button, Box, IconButton, TextField } from "@mui/material";
import { Add, Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import CustomHookSelect from "../../Components/HookSelect/CustomHookSelect";
import { useNavigate, createSearchParams } from "react-router-dom";
import { INavOptions } from "../../Interfaces/Interfaces";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import classes from "./styles.module.scss";

const HomePage = () => {
  const [waypointComps, setWaypointComps] = useState<JSX.Element[]>([]);
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();
  const {
    handleSubmit,
    reset,
    control,
    watch,
    register,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = watch((value) =>
      value.city_of_origin.length > 0 && value.city_of_destination.length > 0
        ? setDisabled(false)
        : setDisabled(true)
    );
    return () => subscription.unsubscribe();
  });

  const onSubmit = (data: any) => {
    let navOptions: INavOptions = {
      city_of_origin: "",
      city_of_destination: "",
      waypoints_city: [],
      waypoints_string: "",
      number_of_people: "0",
    };
    for (let prop of Object.keys(data)) {
      let propObj = data[prop];
      if (prop.includes("waypoint_city")) {
        navOptions.waypoints_city.push(propObj);
      } else {
        navOptions[prop] = propObj;
      }
    }
    navOptions.waypoints_string = JSON.stringify(navOptions.waypoints_city);

    navigate({
      pathname: "/trip",
      search: `?${createSearchParams(navOptions).toString()}`,
    });
  };
  const handleAddStop = () => {
    const elementID = uuidv4();
    const stopElement = (
      <Box
        key={elementID}
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            width: "90%",
          }}
        >
          <CustomHookSelect
            name={`waypoint_city-id:${elementID}`}
            label="Waypoint City"
            control={control}
            defaultValue=""
          />
        </Box>
        <Box>
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="label"
            onClick={() => handleDeleteWaypoint(elementID)}
          >
            <Close />
          </IconButton>
        </Box>
      </Box>
    );

    setWaypointComps([...waypointComps, stopElement]);
  };

  const handleDeleteWaypoint = (uuid: string) => {
    let filteredWaypoints = [
      ...waypointComps.filter((waypoint) => waypoint.key !== uuid),
    ];
    setWaypointComps(filteredWaypoints);
  };

  return (
    <form className={classes.form}>
      <TextField
        required
        label="Number of Passengers"
        fullWidth
        margin="dense"
        variant="outlined"
        type="number"
        defaultValue={1}
        {...register("passengers")}
        error={errors.fullname ? true : false}
      />
      {errors.passengers?.type === "required" && (
        <p role="alert">Number of passengers is required. Min value is 1</p>
      )}

      <CustomHookSelect
        name="city_of_origin"
        label="City of Origin"
        control={control}
        defaultValue={""}
      />

      {waypointComps.map((waypointItem) => waypointItem)}
      <Box>
        <Button variant="outlined" startIcon={<Add />} onClick={handleAddStop}>
          Add Stop
        </Button>
      </Box>

      <CustomHookSelect
        name="city_of_destination"
        label="City of Destination"
        control={control}
        defaultValue={""}
      />

      <Controller
        control={control}
        name="date"
        defaultValue={new Date()}
        render={({ field: { onChange, value } }) => (
          <>
            <ReactDatePicker
              onChange={onChange}
              className="form-control"
              dateFormat="d MMM yyyy"
              minDate={new Date()}
              selected={value}
              showTimeSelect={false}
              dropdownMode="select"
              isClearable
              placeholderText="Select Date"
              shouldCloseOnSelect
            />
            {errors.date && <span>Date must be in the future</span>}
          </>
        )}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: 4,
        }}
      >
        <Button onClick={handleSubmit(onSubmit)} disabled={disabled}>
          Submit
        </Button>
        <Button onClick={() => reset()} variant={"outlined"}>
          Reset
        </Button>
      </Box>
    </form>
  );
};

export default HomePage;
