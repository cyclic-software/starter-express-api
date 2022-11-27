import axios from "axios";

let config = {
  headers: {
    Authorization: "Bearer " + process.env.TOKEN,
  },
};

let pro_id = {
  rusman: 331999484,
  iyd: 181716137,
  mocel: 389033587,
  ramji: 122255316,
  julio: 180011187,
  cije: 162539779,
};

function randomPlayer() {
  return pro_id[
    Object.keys(pro_id)[Math.floor(Math.random() * Object.keys(pro_id).length)]
  ];
}

function paramFilter(param) {
  return !isNaN(param) && param.length != 0 ? param : randomPlayer();
}

function switchRespon(respon, method) {
  let rank = [
    "Gak Pernah Maen RANK",
    "Herbal",
    "Guardian",
    "Crusadog",
    "Archontol",
    "Legentod",
    "Ancien si paling jago",
    "Divine Gendongan",
    "Immortal",
  ];
  let result;
  let data =
    respon.status == 200
      ? respon.data
      : respon.status == 204
      ? { error: "Id palsu taiiik 😡" }
      : { error: "Server Error" };

  if (data.error) {
    result = data.error;
  } else {
    let medal = data.steamAccount.seasonRank;
    method = method.length < 2 && medal == 80 ? "medal" : method;
    switch (method.toLowerCase()) {
      case "steam":
        result = " | STEAM : " + data.steamAccount.profileUri;
        break;
      case "medal":
        let imo =
          medal == 80
            ? " | RANK : -+" + data.steamAccount.seasonLeaderboardRank
            : " ";
        result = " | MEDAL : " + rank?.[medal.toString()[0]] + imo;
        break;
      default:
        result =
          " | Smurf Flag : " +
          data.steamAccount.smurfFlag +
          " | Check Date : " +
          new Date(data.steamAccount.smurfCheckDate * 1000).toDateString();
    }

    result = "NAME : " + data.steamAccount.name + result;
  }

  return result;
}

export const getDotaInfo = async (req, res) => {
  // URL/req_id?dota_id=123&method=steam
  const req_id = req.params.req_id; // channel_id + user_id;
  const dota_id = paramFilter(req.query.dota_id);
  const method = req.query.method;

  //   console.log(req.query.dota_id.length);
  //   console.log(dota_id);
  //   console.log(method);
  let result;

  try {
    result = await axios.get(
      "https://api.stratz.com/api/v1/Player/" + dota_id,
      config
    );
  } catch (error) {
    // try {
    //   result = await axios.get(
    //     "https://api.opendota.com/api/players/" + dota_id
    //   );
    // } catch (error) {
    result = { error: "Not Found" };
    // }
  }

  //   console.log(switchRespon(result, method));
  res.status(200).send(switchRespon(result, method));
  //   res.send(result);
};

// export const getDotaInfo = async (req, res) => {
//     const dota_id = req.params.dota_id;
//     axios.all([
//         axios.get('https://api.opendota.com/api/players/203834555'),
//         axios.get('https://api.stratz.com/api/v1/Player/203834555', config)
//     ]).then(axios.spread((data1, data2) => {
//         let respon = {};
//         respon['data 1'] = data1.data;
//         respon['data 2'] = data2.data;
//         res.status(200).json(respon);
//         // console.log('data 1: ',respon);
//     })).catch( (er)=>res.status(400).json(er.response.data));
// }

export const getHome = async (req, res) => {
  console.log("HALOO");
};
