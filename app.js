const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/lokasi", async (req, res) => {
    const kota = req.query.kota || "Jakarta";

    const apiKey = "API_KEY_KAMU";

    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apiKey}`;

    try {
        const response = await axios.get(url);

        console.log(response.data);

        const data = response.data;

        if (!data.features || data.features.length === 0) {
            return res.status(404).json({
                message: "Lokasi tidak ditemukan"
            });
        }

        const feature = data.features[0];

        const lokasi = feature.text;
        const koordinat = feature.geometry.coordinates;

        let negara = "-";
        let provinsi = "-";
        let kecamatan = "-";

        if (feature.context) {
            feature.context.forEach((item) => {
                if (item.id.startsWith("country.")) {
                    negara = item.text;
                }

                if (item.id.startsWith("region.")) {
                    provinsi = item.text;
                }

                if (
                    item.id.startsWith("county.") ||
                    item.id.startsWith("municipality.") ||
                    item.id.startsWith("locality.")
                ) {
                    kecamatan = item.text;
                }
            });
        }

        res.json({
            lokasi: lokasi,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: koordinat[0],
            latitude: koordinat[1]
        });

    } catch (error) {
        console.error(error.message);

        res.status(500).json({
            message: "Gagal mengambil data dari MapTiler"
        });
    }
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});