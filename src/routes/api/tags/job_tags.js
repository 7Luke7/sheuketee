"use server"

//// GENERAL
    // We should always check tags before adding new things to it to see if it already has the thing added.

/// TITLE 
    // get all the categories and check if any of the field incudes 3 or more letters that title might have.
    // if yes then show that one title word as a tag.


/// CHECK THE CHATGPT BOOKMARK AND DESKTOP
export const populate_single_job_tags = async (title, address, categories, price, description) => {
    try {
        const tags = []
        const tag_possibility = {
            address: 3,
            price: 3,
            description: 3,
            title: 3,
            categories: 3,
        }

        if (!address)
        tags.push()
        tags.push(price)
        

    } catch (error) {
        console.log(error)
    }
}