const NodeHelper = require("node_helper");
var unifi = require('node-unifi');
var self = "";
module.exports = NodeHelper.create(
	{
		start: function() 
		{
			self=this;
			this.sites = null;
			this.sites_data = {};
			console.log(this.name + " is started!")	;
		},
		stop: function()
		{
			console.log(this.name + " Shutting down node_helper for module " + this.name);
			this.connection.close();
		},
		getControllerData: async function()
		{
			console.log(self.name + " getControllerData called as part of data get");
			const controller = new unifi.Controller({host: self.config.controllerURL, port: self.config.port, sslverify: false, timeout: 10000, retrying: true});
			await controller.login(self.config.user, self.config.password)
			.then(result =>
			{
				self.logged_in=result;
				if (result)
				{
					return controller.getSitesStats();
				}
				return;
			})
			.then(sites =>
			{
				self.sites_data={};
				getData(self.sites_data);
				self.sendSocketNotification("UNIFI_DATA_RESPONSE", this.sites_data);
				return self.sites_data;
				async function getData(sites_data)
				{
					self.sites=sites;
					console.log(self.name + " Logged in to Controller and Connected to site " + sites[self.config.siteNo].desc);
					self.sites_data["site_desc"] = self.sites[self.config.siteNo].desc;
					self.sites_data["site_alarms"] = self.sites[self.config.siteNo].num_new_alarms;
					self.sites_data["site_wan_in"] = (((self.sites[self.config.siteNo].health[1]["rx_bytes-r"])/1024)/1024).toFixed(2);
					self.sites_data["site_wan_out"] = (((self.sites[self.config.siteNo].health[1]["tx_bytes-r"])/1024)/1024).toFixed(2);
					self.sites_data["site_aps_adopted"] = self.sites[self.config.siteNo].health[0].num_adopted;
					self.sites_data["site_aps_disabled"] = self.sites[self.config.siteNo].health[0].num_disabled;
					self.sites_data["site_aps_disconnected"] = self.sites[self.config.siteNo].health[0].num_disconnected;
					self.sites_data["site_aps_pending"] = self.sites[self.config.siteNo].health[0].num_pending;
					self.sites_data["site_sws_adopted"] = self.sites[self.config.siteNo].health[3].num_adopted;
					self.sites_data["site_sws_disabled"] = 0; //This is set explicitly to 0 as switches cannot be disabled;
					self.sites_data["site_sws_disconnected"] = self.sites[self.config.siteNo].health[3].num_disconnected;
					self.sites_data["site_sws_pending"] = self.sites[self.config.siteNo].health[3].num_pending;
					self.sites_data["site_users_wired"] = self.sites[self.config.siteNo].health[3].num_user;
					self.sites_data["site_users_wireless"] = self.sites[self.config.siteNo].health[0].num_user;
					self.sites_data["site_users_guests"] = self.sites[self.config.siteNo].health[0].num_guest;
					self.sites_data["site_users_remote"] = self.sites[self.config.siteNo].health[4].remote_user_num_active;
					//controller.logout();
					return await self.sites_data;
				}
			})
			.catch(error =>
			{
				console.log(self.name + ' ERROR: ' + error);
				self.sendSocketNotification("UNIFI_DATA_ERROR", "Not Logged In");
			})
	},
	socketNotificationReceived: function (notification, payload)
	{
		if (notification == "SET_CONFIG")
		{
			console.log(this.name + " SET_CONFIG event received from the core module");
			this.config = payload;
			console.log (this.name + " The controller from config is " + this.config.controllerURL);
		}
		else if (notification == "UNIFI_GET_DATA")
		{
			console.log(self.name + " UNIFI_GET_DATA event received from the core module");
			this.getControllerData();
		}
	}
});