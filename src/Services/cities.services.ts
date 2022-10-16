import axios from "axios";
import { ICity } from "../Interfaces/Interfaces";

const http = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 10000,
});

export const getCities = async (): Promise<ICity[]> => {
  return new Promise(async (resolve, reject) => {
    let result = await http.get("/cities").then((res) => res.data);

    setTimeout(() => {
      let randInt = Math.floor(Math.random() * 10);
      if (randInt > 10) {
        reject(new Error("Something Went Wrong"));
      } else {
        resolve(result);
      }
    }, 3000);
  });
};

export const getDirections = async (queryString: string) => {
  return await axios.get(
    `https://maps.googleapis.com/maps/api/directions/json${queryString}`
  );
};
