let request = require("request-promise").defaults({jar: true});
const cheerio = require('cheerio');

const Discord = require("discord.js"); // imports the discord library
const fs = require("fs"); // imports the file io library

const client = new Discord.Client(); // creates a discord client
const token = fs.readFileSync("token.txt").toString(); // gets your token from the file
const pings = fs.readFileSync("pings.txt").toString(); // gets the notification recipients form the file

client.once("ready", () => { // prints "Ready!" to the console once the bot is online
	console.log("Discord online");
});

async function main(){
	const result1 = await request.get("https://evisaforms.state.gov/Instructions/ACSSchedulingSystem.asp");
	
	let $ = cheerio.load(result1);
	let csrf = $("input[name=CSRFToken]").attr('value');
	let url2 = "https://evisaforms.state.gov/acs/default.asp?CSRFToken=" + csrf + "&PostCode=LND&CountryCode=GRBR++++++&CountryCodeShow=&PostCodeShow=&Submit=Submit";
	let url3 = "https://evisaforms.state.gov/acs/make_calendar.asp?type=2&servicetype=02B&pc=LND&CSRFToken="+csrf;
	
	const result2 = await request.get(url2);
	const result3 = await request.get(url3);
	
	$ = cheerio.load(result3);
	let dates = $("td[bgcolor='#ffffc0']").text();
	let count = $("td[bgcolor='#ffffc0']").length-1;
	let output = "No dates available";
	if(count > 0){
		output = count + " date(s) available: " + dates;
		const channel = client.channels.cache.find(ch => ch.name === 'general');
		if (channel.isText()) {
			channel.send(pings+output)
		}
	}
	console.log(output);
}

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function() {
	try{
		main();
	}
	catch(err){
		console.log(err.message);
	}
}, the_interval);

client.login(token); // starts the bot up
