const SteamCommunity = require('../index.js');

const Helpers = require('./helpers.js');

const HELP_SITE_DOMAIN = 'https://help.steampowered.com';

/**
 * Restore a previously removed steam package from your steam account.
 * @param {int|string} packageID
 * @param {function} callback
 */
SteamCommunity.prototype.restorePackage = function(packageID, callback) {
	this.httpRequestPost({
		uri: HELP_SITE_DOMAIN + '/wizard/AjaxDoPackageRestore',
		form: {
			packageid: packageID,
			sessionid: this.getSessionID(HELP_SITE_DOMAIN),
			wizard_ajax: 1
		},
		json: true
	}, wizardAjaxHandler(callback));
};

/**
 * Remove a steam package from your steam account.
 * @param {int|string} packageID
 * @param {function} callback
 */
SteamCommunity.prototype.removePackage = function(packageID, callback) {
	this.httpRequestPost({
		uri: HELP_SITE_DOMAIN + '/wizard/AjaxDoPackageRemove',
		form: {
			packageid: packageID,
			sessionid: this.getSessionID(HELP_SITE_DOMAIN),
			wizard_ajax: 1
		},
		json: true
	}, wizardAjaxHandler(callback));
};

/**
 * Create Steam Help Request
 * @param {string} steamid
 * @param {string} email
 * @param {string} phoneNumber
 * @param {string} text
 * @param {function} callback
 */
SteamCommunity.prototype.createHelpRequest = function (steamid, email, phoneNumber, text, callback) {
	this.httpRequestPost({
		uri: HELP_SITE_DOMAIN + '/wizard/AjaxCreateHelpRequest',
		form: {
			help_request_type: 41,
			help_issue: 412,
			validation_id: 0,
			validation_code: '',
			steamid,
			extended_string_first_email: email,
			extended_string_phone_number_pop: phoneNumber,
			extended_string_message: text,
			sessionid: this.getSessionID(HELP_SITE_DOMAIN),
			wizard_ajax: 1,
			gamepad: 0,
		},
		json: true
	}, wizardAjaxHandler(callback));
}

/**
 * Returns a handler for wizard ajax HTTP requests.
 * @param {function} callback
 * @returns {(function(*=, *, *): void)|*}
 */
function wizardAjaxHandler(callback) {
	return (err, res, body) => {
		if (!callback) {
			return;
		}

		if (err) {
			callback(err);
			return;
		}

		if (!body.success) {
			callback(body.errorMsg ? new Error(body.errorMsg) : Helpers.eresultError(body.success));
			return;
		}

		callback(null);
	};
}
