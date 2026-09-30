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

        const lokasi = data.features[0].matching_text;
        const koordinat = data.features[0].geometry.coordinates;

        res.json({
            kota: lokasi,
            koordinat: koordinat
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