import React, { useState } from "react";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Controller } from "react-hook-form";
import { MutatingDots } from "react-loader-spinner";

import { ICity } from "../../Interfaces/Interfaces";
import { getCities } from "../../Services/cities.services";

type Props = {
  name: string;
  label: string;
  control: any;
  defaultValue: string;
};

const CustomHookSelect = ({
  name,
  label,
  control,
  defaultValue,
  ...props
}: Props) => {
  const [isLoading, toggleIsLoading] = useState(false);
  const [gotData, toggleGotData] = useState(false);
  const [cities, setCities] = useState<ICity[]>([]);

  const labelId = `${name}-label`;

  const handleGetCities = async () => {
    await getCities()
      .then((res) => setCities(res))
      .catch((err) => console.error(err, "[ERROR]"));
    toggleGotData(true);
    toggleIsLoading(false);
  };

  const handleSelectOpen = () => {
    if (gotData) return;
    toggleIsLoading(true);
    handleGetCities();
  };

  return (
    <FormControl
      {...props}
      sx={{
        width: "100%",
        marginBottom: 2,
        marginTop: 2,
      }}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        render={({ field }) => (
          <Select
            onOpen={handleSelectOpen}
            {...field}
            labelId={labelId}
            label={label}
            required={true}
          >
            {isLoading && !gotData ? (
              <MutatingDots
                height="100"
                width="100"
                color="#425F57"
                secondaryColor="#425F57"
                radius="12.5"
                ariaLabel="mutating-dots-loading"
                wrapperStyle={{}}
                wrapperClass="mutating-dots-loading"
                visible={true}
              />
            ) : (
              cities.map((city: ICity) => (
                <MenuItem key={`${city.city}_key`} value={JSON.stringify(city)}>
                  {city.city}
                </MenuItem>
              ))
            )}
          </Select>
        )}
        name={name}
        control={control}
        defaultValue={defaultValue}
      />
    </FormControl>
  );
};

export default CustomHookSelect;
