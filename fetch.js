let positions = [];

let mitra = new Set();

async function fetchPositions(limit = 100, offset = 0) {
    let fetch_position = await fetch(`https://api.kampusmerdeka.kemdikbud.go.id/magang/browse/position?offset=${offset}&limit=${limit}&sort_by=published_time&order=desc`, {
        "headers": {
            "accept": "*/*",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ha;q=0.6,ms;q=0.5",
            "sec-ch-ua": "\"Google Chrome\";v=\"119\", \"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "Referer": "https://kampusmerdeka.kemdikbud.go.id/",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
    });
    return await fetch_position.json();
}

async function main() {
    let temp = await fetchPositions();
    let offset = 0;
    let total = temp.meta.total;

    while (total > 0) {
        positions.push(...temp.data);
        total -= temp.data.length;
        offset += temp.data.length;
        temp = await fetchPositions(total >= 100 ? 100 : total, offset);
    }

    console.log(positions);

    let count = 0;
    positions.forEach(element => {
        mitra.add(element.mitra_name);

        count++;
    });

    console.log(mitra);
}

main();