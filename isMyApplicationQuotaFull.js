let access_token = "PUT_YOUR_ACCESS_TOKEN_HERE";

async function fetchAppliedPositions() {
  let fetch_position = await fetch(
    "https://api.kampusmerdeka.kemdikbud.go.id/mbkm/mahasiswa/activities/my?offset=0&limit=22",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
  // data : {id}
  return await fetch_position.json();
}

async function fetchPositionDetail(id) {
  let url =
    "https://api.kampusmerdeka.kemdikbud.go.id/mbkm/mahasiswa/activities/my/" +
    id;

  let fetch_position = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });

  return await fetch_position.json();
}

async function isMyApplicationQuotaFull(positionId) {
  let url =
    "https://api.kampusmerdeka.kemdikbud.go.id/magang/browse/position/" +
    positionId;
  let fetch_position = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: null,
    method: "GET",
  });

  let positionDetail = await fetch_position.json();
  return positionDetail.data.is_quota_full;
}

async function main() {
  let positions = await fetchAppliedPositions();
  let positionIds = [];
  let positionNames = [];
  let positionsQuotaFull = [];

  for (const position of positions.data) {
    let positionDetail = await fetchPositionDetail(position.id);
    positionIds.push(positionDetail.data.position_id);
    positionNames.push(
      positionDetail.data.mitra_brand_name +
        " - " +
        positionDetail.data.nama_kegiatan
    );
    let isFull = await isMyApplicationQuotaFull(
      positionDetail.data.position_id
    );
    positionsQuotaFull.push(isFull);
  }

  let result = [];
  for (let i = 0; i < positionIds.length; i++) {
    result.push({
      positionId: positionIds[i],
      positionName: positionNames[i],
      isQuotaFull: positionsQuotaFull[i],
    });
  }

  console.log(result);
}

main();
