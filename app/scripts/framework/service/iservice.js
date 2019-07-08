/* istanbul ignore next */
org.ekstep.services.iService = Class.extend({
	/**
     * @member {object} requestHeaders
     * @memberof org.ekstep.services.iService
     */
	requestHeaders: {
        'headers': {
            'content-type': 'application/json',
            'user-id': 'content-editor',
            'X-Channel-ID': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'x-authenticated-userid': '874ed8a5-782e-4f6c-8f36-e0288455901e',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmMzU5MzdlOWZmY2U0OWVjOTFhMWM2ZjNiMGRkODNjZSJ9.-TFevs_hwibGVswDBJhhgcJ3I4jEi1_dWuiNHsqMOoc',
            'x-authenticated-user-token': 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ1S3RNazNCdDVOTC1QWWNSbV9iSk1Ndm4teWFGeDhoc2NyOUVXZDZwdzhVIn0.eyJqdGkiOiJlMmI0MTcyYy04OGM4LTQ2OTYtYmY4Ni0wZTU2NTUwNDI1Y2EiLCJleHAiOjE1NTc3NjA0MzIsIm5iZiI6MCwiaWF0IjoxNTU3NzM4ODMyLCJpc3MiOiJodHRwczovL2NhbWluby5zdGFja3JvdXRlLmNvbS9hdXRoL3JlYWxtcy9zdW5iaXJkIiwiYXVkIjoiYWRtaW4tY2xpIiwic3ViIjoiNmYzMjRkYjctMzJhNS00NDM3LWE0NTEtMzVjZjUzMjY5YWFmIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYWRtaW4tY2xpIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNTY3OThjN2UtMGNkMS00MGJmLTlkMWItMjYxYTQ1ZWE2ZGZlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6W10sInJlc291cmNlX2FjY2VzcyI6e30sIm5hbWUiOiJBZGl0eWEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJhZGl0eWEiLCJnaXZlbl9uYW1lIjoiQWRpdHlhIiwiZW1haWwiOiJhZGl0eWFAbmlpdC5jb20ifQ.Ma1_8ccaBXaHN2DVR2GOUng91b7kPonhMvXtLO2E1uVgNvWZt8YS68WRcFIZ6Ap9kQ9Pd6RWpQbg4vJ3ee83_jWi7S9xtjW-82b2-VBFi7TR_0mMPzIvrBqrSZCogskTYOv9TjJKZeka3PVfw49X_x68u2JZgWqE8mRjtpKsU2Ffq62YMPUABbFqT2C7nNqHHKfO-Egxc0nvCsJl-31piMpCyveQ_lYPQgZCaety2VjwVV5K3oILR-B0dM9oBKVNX-cqA6cLlsx-YpQv12mzk8P1NpOboRav-12jRhmJr011RqhSLFNe0a4NDMKdvMKJIsMK0v66NBvz7ZmAvU1t'
        }
    },
	getBaseURL: function () {
		return org.ekstep.services.config.baseURL
	},
	getAPISlug: function () {
		return org.ekstep.services.config.apislug
	},
	getConfig: function (configKey, _default) {
		return org.ekstep.services.config[configKey] || _default
	},
	init: function (config) {
		this.initService(config)
	},
	initService: function (config) {},
	_dispatchTelemetry: function (data) {
		var status = data.res.responseCode || data.res.statusText
		org.ekstep.services.telemetryService.apiCall({ 'path': encodeURIComponent(data.url), 'method': data.method, 'request': data.request, 'response': '', 'responseTime': data.res.responseTime, 'status': status, 'uip': '' })
	},
	_call: function (ajaxSettings, config, cb) {
		var requestTimestamp; var instance = this
		config = config || {}
		ajaxSettings.headers = config.headers || {}
		ajaxSettings.beforeSend = function (xhrObject, settings) {
			requestTimestamp = (new Date()).getTime()
		}
		ajaxSettings.success = function (res) {
			res.responseTime = (new Date()).getTime() - requestTimestamp
			var request = ajaxSettings.type === 'POST' ? ajaxSettings.data : {}
			instance._dispatchTelemetry({ url: ajaxSettings.url, method: ajaxSettings.type, request: request, res: res })
			res = { data: res }
			cb(null, res)
		}
		ajaxSettings.error = function (err) {
			err.responseTime = (new Date()).getTime() - requestTimestamp
			cb(err, null)
			var request = ajaxSettings.type === 'POST' ? ajaxSettings.data : {}
			instance._dispatchTelemetry({ url: ajaxSettings.url, method: ajaxSettings.type, request: request, res: err })
		}

		if (!_.isUndefined(config.contentType)) ajaxSettings.contentType = config.contentType
		if (!_.isUndefined(config.cache)) ajaxSettings.cache = config.cache
		if (!_.isUndefined(config.processData)) ajaxSettings.processData = config.processData
		if (!_.isUndefined(config.enctype)) ajaxSettings.enctype = config.enctype

		org.ekstep.pluginframework.jQuery.ajax(ajaxSettings)
	},
	get: function (url, config, cb) {
		this._call({ type: 'GET', url: url }, config, cb)
	},
	put: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'PUT', url: url, data: data }, config, cb)
	},
	post: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'POST', url: url, data: data }, config, cb)
	},
	patch: function (url, data, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		if (typeof data === 'object' && _.isUndefined(config.contentType)) data = JSON.stringify(data)
		this._call({ type: 'PATCH', url: url, data: data }, config, cb)
	},
	delete: function (url, config, cb) {
		// eslint-disable-next-line
		if (typeof cb !== 'function') throw 'iservice expects callback to be function'
		this._call({ type: 'DELETE', url: url }, config, cb)
	},
	/**
     * Utility function which is used to call http post request
     * @param  {string}   url      API url
     * @param  {object}   data     APT request data
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
	postFromService: function (url, data, headers, callback) {
		this.post(url, data, headers, function (err, res) {
			callback(err, res)
		})
	},
	/**
     * Utility function which is used to call http get request
     * @param  {string}   url      API url
     * @param  {object}   headers  API headers
     * @param  {Function} callback returns error and response as arguments
     * @memberof org.ekstep.services.iService
     */
	getFromService: function (url, headers, callback) {
		this.get(url, headers, function (err, res) {
			callback(err, res)
		})
	}

})
