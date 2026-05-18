import { allCountries } from "country-telephone-data";

export const getAllCountries = () =>
  allCountries.map((c) => ({
    name: c.name,
    iso2: c.iso2.toUpperCase(),
    dialCode: `+${c.dialCode}`,
  }));
