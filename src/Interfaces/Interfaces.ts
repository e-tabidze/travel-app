export interface ICity {
  city: string;
  latitude: number | any;
  longitude: number | any;
}

export interface INavOptions {
  city_of_origin: string,
  city_of_destination: string,
  waypoints_city: string[],
  number_of_people: string
  [key: string]: string | string[]
}

export interface IResultObj {
  city_of_origin: ICity,
  city_of_destination: ICity,
  waypoints_city: ICity[],
  number_of_people: number,
  [key: string]: ICity | ICity[] | number
}