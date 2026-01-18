const axios = require("axios");

(async () => {
  try {
    const res = await axios.get(
      "https://atcoder.jp/contests/?lang=en",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Linux x86_64) Chrome/120.0.0.0"
        }
      }
    );
    console.log("HTML length:", res.data.length);
  } catch (e) {
    console.error("FETCH FAILED:", e.message);
  }
})();
