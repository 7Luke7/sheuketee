"use server"

export const create_serializable_object = (user) => {
    return {
        ...user._doc,
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    };
};

export const create_serializable_object_secure = (user) => {
    const {password, __v, _id, notificationDevices, ...restUser} = user._doc
    return {
        ...restUser,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
    };
};