# MMM-UnifiNetwork
MagicMirror module that displays various statistics from your Unifi Network Application. It uses the Unifi API and has been tested on 5.x,6.x and 7.x versions of the Unifi Network Applications. It should work on earlier versions but has not been tested.

## Install
```
cd <Magic Mirror Directory>/modules
git clone https://github.com/nuttersrest/MMM-UnifiNetwork.git
cd MMM-UnifiNetwork
npm install
```
## Configuration
```
{
	disabled: false,
	module: "MMM-UnifiNetwork",
	position: "top_right",
	header: 'Unifi Network Application',
		config: 
		{
			controllerURL: "unifi.example.com",	
			user: "MagicMirror",  							
			password: "password",						
			port: "443",											
			updateInterval: 1,								
			siteNo: "0"													
		}
}
```
