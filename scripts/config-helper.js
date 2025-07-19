require("dotenv").config();

module.exports = {
	getGoogleMapsKey: () => {
		return process.env.GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE";
	},
};
