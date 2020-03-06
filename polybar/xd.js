const fetch = require("node-fetch");

const currentSong = async () => {
  const song = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          "BQBlzb-4jaHzjbeZSbT3047YFKt8dsgRmht0SHJEI_Ht6RnRtQCRLBhCOJZN9od2sNSFcT2fjcguUre8o1DtmIbRaNpLATBu_Ns4qbA1DFcqsX-kwo5K6AsgqVaYJVphL_0TBRWhu9ZYkCscWrNNveulby7n91k5TzyGpYpj"
      }
    }
  ).then(x => console.log(x));
};

currentSong();
