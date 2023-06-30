import basics from "./exercises-basics.json";
import classes from "./exercises-classes.json";
import composition from "./exercises-composition.json";
import that from "./exercises-this.json";
import promises from "./exercises-promises.json";

export interface Exercise {
    code: string;
    hard?: boolean;
}

export const exercises = [...basics, ...classes, ...composition, ...that, ...promises] as unknown as Exercise[];
