require("dotenv").config();

hexo.extend.helper.register("getGoogleMapsKey", function () {
	return process.env.GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
});
