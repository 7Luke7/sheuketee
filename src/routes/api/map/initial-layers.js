"use server"

export async function GET({request}) {
    try {
        const url = new URL(request.url);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");
        const acc = url.searchParams.get("acc");

        tilelive.load(uri, (err, tileObject) => {
            if (err) {
                throw new Error(err)
            } else {
                console.log(tileObject)
            }
        })

    } catch (error) {
        console.log(error)
    }
}