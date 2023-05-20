//MMM-UnifiNetwork.js:

Module.register("MMM-UnifiNetwork",
	{
  		// Default module config.
		defaults:
		{
			updateInterval: 1,
			controllerURL: "unifi",
			user: "ubnt",
			password: "ubnt",
			port: "443",
			siteNo: "0",
			header: "Unifi Network Application"
		},
		getStyles: function ()
		{
			return ["MMM-UnifiNetwork.css"];
		},
		isEmptyObject: function(obj)
		{
			for (var key in obj)
			{
				if (Object.prototype.hasOwnProperty.call(obj, key))
				{
					return false;
				}
			}
			return true;
		},
		start: function()
		{
			Log.info(this.name + ' is started!');
			self = this;
			let site_data = {};
			this.sendSocketNotification('SET_CONFIG', this.config);
			setInterval(function()
			{
				this.getData();
			},
			this.config.updateInterval*(60*1000)); //perform every updateInterval milliseconds.
		},
		// Override dom generator.
		getDom: function ()
		{
			var wrapper = document.createElement("div");
			if (this.config_error && this.isEmptyObject(self.site_data))
			{
				wrapper.innerHTML = "Log In Failed Check Config";
				wrapper.className = "red dimmed light small";
				return wrapper;
			}
			else if (!this.config_error && this.isEmptyObject(self.site_data))
			{
				wrapper.innerHTML = "Connecting to Controller and getting data";
				wrapper.className = "orange dimmed light small";
				return wrapper;
			}
			else if(!this.config_error)
			{
				Log.info("getDom should be some data back");
				Log.info(JSON.stringify(this.site_data));
				wrapper.className = "dimmed light small";
				var ControllerContainer = document.createElement("div");
				ControllerContainer.classList.add("network");
				var site = document.createElement("span");
				site.className = "bright site";
				site.classList.add("site");
				sites = this.site_data;
				site.appendChild(document.createTextNode(sites.site_desc));
				//site.classList.add(lockedcolor);
				ControllerContainer.appendChild(site);
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode(" has "));
				ControllerContainer.appendChild(site_text);
				var alarmscolour="";
				var alarms = document.createElement("span");
				alarms.classList.add("alarms");
				if (sites.site_alarms === 0)
				{
					alarmscolour="green";
					alarms.appendChild(document.createTextNode(sites.site_alarms));
					alarms_className = "bright site";
					alarms.classList.add(alarmscolour);
				}
				else
				{
					alarmscolour="red";
					alarms.appendChild(document.createTextNode(sites.site_alarms));
					alarms.className = "bright site";
					alarms.classList.add(alarmscolour);
				}
				ControllerContainer.appendChild(alarms);
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode(" alarms"));
				ControllerContainer.className = "site";
				ControllerContainer.appendChild(site_text);
				wrapper.appendChild(ControllerContainer);
				ControllerContainer = document.createElement("div");
				ControllerContainer.className = "site";
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode("WAN IN "));
				ControllerContainer.appendChild(site_text);
				var wanin = document.createElement("span");
				wanin.classList.add("wanin");
				wanin.className = "bright site";
				if (isNaN(sites.site_wan_in))
				{
					Log.info("NaN Detected for WAN IN");
					wanin.appendChild(document.createTextNode("N/A"));
				}
				else
				{
					Log.info("Number Detected for WAN IN");
				 	wanin.appendChild(document.createTextNode(sites.site_wan_in));
				}
				//site.classList.add(lockedcolor);
				ControllerContainer.appendChild(wanin);
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode("Mbps "));
				ControllerContainer.appendChild(site_text);
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode(" WAN OUT "));
				ControllerContainer.appendChild(site_text);
				var wanout = document.createElement("span");
				wanout.classList.add("wanout");
				wanout.className = "bright site";
				if (isNaN(sites.site_wan_out))
				{
					Log.info("NaN Detected for WAN OUT");
					wanout.appendChild(document.createTextNode("N/A"));
				}
				else
				{
					Log.info("Number Detected for WAN OUT");
					wanout.appendChild(document.createTextNode(sites.site_wan_out));
				}
				//wanout.appendChild(document.createTextNode(sites.site_wan_out));
				ControllerContainer.appendChild(wanout);
				var site_text = document.createElement("span");
				site_text.classList.add("site_text");
				site_text.className = "site";
				site_text.appendChild(document.createTextNode("Mbps "));
				ControllerContainer.appendChild(site_text);
				wrapper.appendChild(ControllerContainer);
				ControllerContainer = document.createElement("div");
				var table = document.createElement("table");
				table.className = "xsmall";
				var row = document.createElement("tr");
				table.appendChild(row);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "";
				TableHeader.className = "site";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Adopted";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Disabled";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Disconn";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Pending";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var row = document.createElement("tr");
				table.appendChild(row);
				var DeviceRow = document.createElement("td");
				DeviceRow.innerHTML = "APs";
				DeviceRow.className = "site";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				DeviceRow.innerHTML = sites.site_aps_adopted;
				DeviceRow.className = "bright tablecontent";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_aps_disabled === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_aps_disabled;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_aps_disconnected === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_aps_disconnected;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_aps_pending === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_aps_pending;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var row = document.createElement("tr");
				table.appendChild(row);
				var row = document.createElement("tr");
				table.appendChild(row);
				var DeviceRow = document.createElement("td");
				DeviceRow.innerHTML = "SWs";
				DeviceRow.className = "site";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				DeviceRow.innerHTML = sites.site_sws_adopted;
				DeviceRow.className = "bright tablecontent";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_sws_disabled === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_sws_disabled;
				DeviceRow.className = "bright tablecontent";
				//DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_sws_disconnected === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_sws_disconnected;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				var DeviceColour = "";
				if (sites.site_sws_pending === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				DeviceRow.innerHTML = sites.site_sws_pending;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var row = document.createElement("tr");
				table.appendChild(row);
				ControllerContainer.appendChild(table);
				//ControllerContainer = document.createElement("div");
				wrapper.appendChild(ControllerContainer);
				ControllerContainer = document.createElement("div");
				var table = document.createElement("table");
				table.className = "xsmall";
				var row = document.createElement("tr");
				table.appendChild(row);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "";
				TableHeader.className = "site";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Wired";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Wireless";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Guest";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var TableHeader = document.createElement("td");
				TableHeader.innerHTML = "Remote";
				TableHeader.className = "tableheader";
				row.appendChild(TableHeader);
				var row = document.createElement("tr");
				table.appendChild(row);
				var DeviceRow = document.createElement("td");
				DeviceRow.innerHTML = "Users";
				DeviceRow.className = "site";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				if (typeof sites.site_users_wired === 'undefined')
				{
					Log.info("Undefined returned for wired users");
					DeviceRow.innerHTML = "N/A";
				}
				else
				{
					DeviceRow.innerHTML = sites.site_users_wired;
				}
				DeviceRow.className = "bright tablecontent";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				if (typeof sites.site_users_wireless === 'undefined')
				{
					Log.info("Undefined returned for wireless users");
					DeviceRow.innerHTML = "N/A";
				}
				else
				{
					DeviceRow.innerHTML = sites.site_users_wireless;
				}
				//DeviceRow.innerHTML = sites.site_users_wireless;
				DeviceRow.className = "bright tablecontent";
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				if (typeof sites.site_users_guests === 'undefined')
				{
					Log.info("Undefined returned for guest users");
					DeviceRow.innerHTML = "N/A";
				}
				else
				{
					DeviceRow.innerHTML = sites.site_users_guests;
				}
				var DeviceColour = "";
				if (sites.site_users_guests === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				//DeviceRow.innerHTML = sites.site_users_guests;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				var DeviceRow = document.createElement("td");
				if (typeof sites.site_users_remote === 'undefined')
				{
					Log.info("Undefined returned for remote users");
					DeviceRow.innerHTML = "N/A";
				}
				else
				{
					DeviceRow.innerHTML = sites.site_users_remote;
				}
				var DeviceColour = "";
				if (sites.site_users_remote === 0)
				{
					DeviceColour="green";
				}
				else
				{
					DeviceColour="red";
				}
				//DeviceRow.innerHTML = sites.site_users_remote;
				DeviceRow.className = "bright tablecontent";
				DeviceRow.classList.add(DeviceColour);
				row.appendChild(DeviceRow);
				wrapper.appendChild(table);
				ControllerContainer.appendChild(table);
				wrapper.appendChild(ControllerContainer);
				return wrapper;
			}
		},
		getHeader: function()
		{
			return this.data.header;
		},
		getData:	function()
		{
			this.sendSocketNotification("UNIFI_GET_DATA", this.sites);
		},
		notificationReceived: function (notification, payload, sender)
		{
			if (notification === "ALL_MODULES_STARTED")
			{
			}
			else if (notification === "DOM_OBJECTS_CREATED")
			{
				this.sendSocketNotification("UNIFI_GET_DATA", this.sites);
			}
			else if (notification === "MODULE_DOM_CREATED")
			{
			}
		},
		socketNotificationReceived: function (notification, payload)
		{
			if(notification === "UNIFI_DATA_RESPONSE")
			{
				//set dataNotification
				this.config_error=false;
				Log.info("UNIFI_DATA_RESPONSE event received from the node_helper module " + payload);
				this.site_data = payload;
				this.updateDom();
			}
			else if (notification === "UNIFI_DATA_ERROR")
			{
				Log.error("UNIFI_DATA_ERROR event received from node_helper, check config and credentials " + JSON.stringify(payload));
				this.config_error=true;
				this.error_message=payload;
				this.site_data = {};
				this.updateDom();
			}
		}
	}
);
