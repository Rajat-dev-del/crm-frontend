import { City, State } from "country-state-city";

const IN_STATES = State.getStatesOfCountry("IN");

/** All Indian state names, alphabetically. */
export const INDIAN_STATES: string[] = IN_STATES.map((s) => s.name);

/** Map from state name to its sorted list of city names. */
export const CITIES_BY_STATE: Record<string, string[]> = Object.fromEntries(
  IN_STATES.map((state) => [
    state.name,
    City.getCitiesOfState("IN", state.isoCode).map((c) => c.name).sort(),
  ]),
);
