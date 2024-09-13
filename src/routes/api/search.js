"use server";
import { getRequestEvent } from "solid-js/web";
import { Xelosani } from "./models/User";
import { getTimeAgo } from "./user";
import { getDistance } from 'ol/sphere';
import { verify_user } from "./session_management";

// export async function GET(request) {
//     const event = getRequestEvent()
//     try {
//         console.log(event, request)
//     } catch (error) {
//         console.log(error)
//     }
// }

// export const displayable_birth_date = async (date) => {
//     try {

//     } catch (error) {
//         console.log(error)
//     }
// }

export const isUserNearby = async (lon, lat, role, id) => {
  if (role === 1) {
    const xelosani = await Xelosani.findById(id, "location -_id -__t")
    return {
      distance: getDistance([lon, lat], [xelosani.location.lon, xelosani.location.lat]),
      myLocation: xelosani.location
    }
  } else {

  }
}

export const MainSearch = async (type, name) => {
  const event = getRequestEvent()
  try {
    const user = await verify_user(event)
    if (type === "ხელოსანი") {
      const xelosani = await Xelosani.find(
        {
          $or: [
            { firstname: { $regex: name } },
            { lastname: { $regex: name } },
          ],
        },
        "-_id gender firstname lastname workCount reviewCount about createdAt profId role -__t"
      ).lean()
      //-_id -__t -email -stepPercent -updatedAt -password -__v -phone -notificationDevices
      for (let i = 0; i < xelosani.length; i++) {
        const creationDateDisplayable = getTimeAgo(xelosani[i].createdAt);
        xelosani[i].createdAt = creationDateDisplayable;
        // if (xelosani[i].location && xelosani.profId !== user.profId) {
        //   const distance = await isUserNearby(xelosani[i].location.lon, xelosani[i].location.lat, user.role, user.userId)
        //   xelosani[i].distance = `ხელოსანი თქვენგან ${Math.ceil(distance.distance)} მეტრში ცხოვრობს.`
        // }
      } 
      
      return xelosani;
    }
  } catch (error) {
    console.log(error);
  }
};
