import axios from "axios";
import { ICat } from "../types";

export const catsApi = {
    getCat: async (value: string, options: { signal: AbortSignal }) =>
        axios.get<ICat>("https://cataas.com/cat/says/" + value, options),
};
