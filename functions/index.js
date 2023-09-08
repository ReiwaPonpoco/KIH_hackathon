const functions = require("firebase-functions");
const axios = require("axios");
const cors = require("cors")({origin: true});

exports.translateContent = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const text = req.body.text;
    const targetLanguage = req.body.target;
    const apiKey = functions.config().googletranslateapi.key;
    const url = "https://translation.googleapis.com/language/translate/v2";

    try {
      const response = await axios.post(url, null, {
        params: {
          key: apiKey,
          source: "ja",
          target: targetLanguage,
          q: text,
        },
      });

      if (response.data && response.data.data && response.data.data.translations) {
        res.status(200).send({
          translatedText: response.data.data.translations[0].translatedText,
        });
      } else {
        res.status(400).send({error: "Invalid response from the API"});
      }
    } catch (error) {
      res.status(500).send({error: "Translation failed"});
    }
  });
});

exports.getPlaces = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    const latitude = req.query.latitude || 35.6895;
    const longitude = req.query.longitude || 139.6917;
    const apiKey = functions.config().googlemapsapi.key;
    const radius = 50;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&key=${apiKey}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.status === "OK") {
        res.send(data.results);
      } else {
        res.status(400).send(data);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });
});
