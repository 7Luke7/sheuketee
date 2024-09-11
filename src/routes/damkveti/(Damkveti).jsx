
import { get_xelosani } from "../api/user";
import { createAsync } from "@solidjs/router";

const Damkveti = () => {
    const user = createAsync(async () =>
        JSON.parse(await get_xelosani("cb087f53-3482-4c22-9b98-af996d4a442f"))
      );

    return <div>
        hi
        <button onClick={() => console.log(user())}>test</button>
    </div>
}

export default Damkveti