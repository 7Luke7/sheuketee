// "use server"
// import { getRequestEvent } from "solid-js/web";
// import { verify_user } from "../session_management";

// export const get_location = async () => {
//     try {
//       const event = getRequestEvent();
//       const user = await verify_user(event);
  
//       if (user === 401 || user.role === 2) {
//         return 401;
//       }
//       const { location, schedule } = await Xelosani.findById(
//         user.userId,
//         "location -_id schedule -__t"
//       ).lean();
      
//       return {
//         ...location,
//         schedule
//       };
//     } catch (error) {
//       console.log(error);
//     }
//   };