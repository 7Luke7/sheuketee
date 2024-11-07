"use server";
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { HandleError } from "../../utils/errors/handle_errors";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { CustomError } from "../../utils/errors/custom_errors";

export const get_xelosani_step = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    const user = await postgresql_server_request("GET", `xelosani/step_percent/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    return {
      stepPercent: user.stepPercent,
      setupDone: user.setupDone
    };
  } catch (error) {
    console.log(error);
  }
};

export const handle_contact = async (formData, contact) => {
  try {
    const inputText = formData.get("input");
    if (contact === "phone") {
      if (!phoneRegex.test(inputText)) {
        throw new Error("ტელეფონის ნომერი არასწორია.");
      }
    } else {
      if (!emailRegex.test(inputText)) {
        throw new Error("მეილი არასწორია.");
      }
    }

    const event = getRequestEvent();
    const session = await verify_user(event);

    console.log(session)
    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("PUT", `xelosani/update_${contact}/${session.profId}`, {
      body: JSON.stringify({[contact]: inputText}),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      throw new Error("11000")
    }

    return {
      ...user,
      status: 200
    };
  } catch (error) {
    console.log(error)
    if (error.message === "11000") {
      return new HandleError().duplicate_error(
        contact === "phone" ? "ტელეფონის ნომრით" : "მეილით"
      );
    }
    if (error.message === "401") {
      return 401;
    }
    return error.message;
  }
};
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{9}$/;
export const check_contact = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_contact/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.email_exists && !user.phone_exists) {
      return "phone";
    } else if (user.phone_exists && !user.email_exists) {
      return "email";
    } else {
      return "fine";
    }
  } catch (error) {
    if (error.message === "401") {
      return 401;
    }
    console.log(error);
  }
};

export const check_about = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/about/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("about: ", user)
    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error.message === "401") {
      return 401;
    }
  }
};

export const handle_about = async (formData) => {
  try {
    const about = formData.get("about");
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    if (about.length < 75) {
      throw new CustomError("about", "აღწერა უნდა შეიცავდეს მინიმუმ 75 ასოს.")
    }
    if (about.length > 600) {
      throw new CustomError("about", "აღწერა უნდა შეიცავდეს მაქსიმუმ 600 ასოს.")
    }

    const user = await postgresql_server_request("PUT", `xelosani/about/${session.profId}`, {
      body: JSON.stringify({about}),
      headers: {
        "Content-Type": "application/json",
      },
    });      

    return { ...user, status: 200 };
  } catch (error) {
    console.log(error)
    const handled_error = new HandleError(error).validation_error();
    return { ...handled_error[0], status: 400 };
  }
};

export const check_user_age = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_date/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const handle_date_select = async (date) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("PUT", `xelosani/update_date/${session.profId}`, {
      body: JSON.stringify({
        date
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { ...user, status: 200 };
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const check_selected_jobs = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_skills/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const handle_selected_skills = async (skills) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("POST", `xelosani/insert_skills/${session.profId}`, {
      body: JSON.stringify({
        skills
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { ...user, status: 200 };
  } catch (error) {
    console.log(error);
    if (error) {
      return error.message;
    }
  }
};

export const handle_user_gender = async (gender) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("PUT", `xelosani/update_gender/${session.profId}`, {
      body: JSON.stringify({
        gender
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { ...user, status: 200 };
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const check_user_gender = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_gender/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const handle_location = async (location) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }
    if (!location) {
      throw new Error("აირჩიე ლოკაცია");
    }

    const user = await postgresql_server_request("GET", `xelosani/handle_location/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { ...user, status: 200 };
  } catch (error) {
    console.log(error);
  }
};

export const check_location = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_location/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const check_user_schedule = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const user = await postgresql_server_request("GET", `xelosani/check_schedule/${session.profId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (user.status === 400) {
      return 400
    }

    return 200
  } catch (error) {
    if (error) {
      return error.message;
    }
  }
};

export const add_user_schedule = async (formData) => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const schedule = [
      {
        startTime: formData.get("ორშაბათი-საწყისი-დრო"),
        endTime: formData.get("ორშაბათი-სასრული-დრო"),
        day: "ორშაბათი",
      },
      {
        startTime: formData.get("სამშაბათი-საწყისი-დრო"),
        endTime: formData.get("სამშაბათი-სასრული-დრო"),
        day: "სამშაბათი",
      },
      {
        startTime: formData.get("ოთხშაბათი-საწყისი-დრო"),
        endTime: formData.get("ოთხშაბათი-სასრული-დრო"),
        day: "ოთხშაბათი",
      },
      {
        startTime: formData.get("ხუთშაბათი-საწყისი-დრო"),
        endTime: formData.get("ხუთშაბათი-სასრული-დრო"),
        day: "ხუთშაბათი",
      },
      {
        startTime: formData.get("პარასკევი-საწყისი-დრო"),
        endTime: formData.get("პარასკევი-სასრული-დრო"),
        day: "პარასკევი",
      },
      {
        startTime: formData.get("შაბათი-საწყისი-დრო"),
        endTime: formData.get("შაბათი-სასრული-დრო"),
        day: "შაბათი",
      },
      {
        startTime: formData.get("კვირა-საწყისი-დრო"),
        endTime: formData.get("კვირა-სასრული-დრო"),
        day: "კვირა",
      },
    ];

    const user = await postgresql_server_request("POST", `xelosani/insert_schedule/${session.profId}`, {
      body: JSON.stringify({
        schedule,
        xelosaniId: session.userId
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return { ...user, status: 200 };
  } catch (error) {
    console.log(error);
  }
};