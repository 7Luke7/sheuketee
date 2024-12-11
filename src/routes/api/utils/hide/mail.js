"use server"

export const hide_email = (email) => {
    return email.replace(/(\w{3})[\w.-]+@([\w.]+\w)/, "$1***@$2")
}

export const hide_mobile_number = (number) => {
    return number.replace(/(\d{3})\d{3}(\d{3})/, "$1***$2");
}