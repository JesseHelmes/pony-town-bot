const event = new Event('input', { bubbles: true });
const enter = new KeyboardEvent('keydown', {
    bubbles: true, cancelable: true, keyCode: 13
});
const pickup = new KeyboardEvent('keydown', {
    bubbles: true, cancelable: true, keyCode: 69
});
let listenToPlayer = [];
let sentencesToRepeat = []; // save all sentences we should remember and repeat.
let allowedToSpeak = false;

const timeStarted = Math.round(new Date().getTime()/1000);
let isUsingMagic = false;

const isTest = false;// this makes sure that we can do commands when we are testing
let botName = 'PonyTownBot'; // the name we should ignore

const observer = new MutationObserver(()=> {
	if((isTest && 
	document.querySelector('.chat-log-scroll-inner .chat-line:last-child').querySelector('.chat-line-name-content').textContent
	=== botName
	) || document.querySelector('.chat-box').hasAttribute('hidden')){
		doCommand();
	}
});

observer.observe(document.querySelector('.chat-log-scroll-inner'), {childList: true});

const speak = setInterval(() => {
	if(!allowedToSpeak){ return; }
	for (var i = 0; i < sentencesToRepeat.length; i++) {
		useChat(sentencesToRepeat[i]);
		setTimeout(null, 1000);//waits before sending another chat sentence.
	}
}, 5000);

/*
Let isTalking = false;
canSpeak = false: or allowedToSpeak = false.
Speak()
Set interval of every 10 seconds.
ListenToPlayer = []; add player who we should listen to.
Clear command
Stop listen() to pony and remove their name out of listenToPlayer.
Always listen to players, so this happens outside of doCommand, but still inside of my chat controller.
Commands to start listen to pony are: say, talk, repeat.
The original bot i saw listened to everyone that told the bot to stop talking.
sentencesToRepeat
*/

//command: 'what is your name?' bot says: `my name is "${botName}"`

//https://pony.town/help
//MAYBE TODO Add questions in default?
//MAYBE TODO Look commands up left right down + maybe the corners. with numpad keys

function doCommand(){
	const commandOwner = document.querySelector('.chat-log-scroll-inner .chat-line:last-child').querySelector('.chat-line-name-content').textContent;
	const givenCommand = document.querySelector('.chat-log-scroll-inner .chat-line:last-child').querySelector('.chat-line-message').textContent;
	const command = givenCommand.split(' ');

	//TODO order and group commands
	switch(command[0]){//.toLowerCase()
		//pt commands
		case 'eat':
		case 'nom':
		case 'munch':
		case 'nibble':
			useChatCommand('nom');
			break;
		case 'boop':
			useChatCommand('boop');
			break;
		case 'roll':
		case 'dice':
		case 'rand':
		case 'random':
			switch(command[1]){
				case '':
					useChatCommand('roll');
					break;
				default:
					useChatCommand(`roll ${command[1]}`);
					break;
			}
			break;
		case 'use':
			useChatCommand('eat');
			break;
		case 'pickup':
		case 'grab':
			pickupCommand();
			break;
		case 'shrug':
		case 'shrugs':
			useChatCommand('shrug');
			break;
		case 'mask':
			useChatCommand('mask');
			break;
		case 'drop':
			useChatCommand('drop');
			break;
		case 'droptoy':
			useChatCommand('droptoy');
			break;
		case 'face':
			switch(command[2]){
				case 'permanent':
					useChatCommand(`e ${command[1]}`);
					break;
				default:
					useChatCommand(command[1]);
					break;
			}
			break;
		case 'reset':
			useChatCommand('e');
			break;
		case 'light':
		case 'magic':
		case 'horn':
		case 'horny':
			//useMagic();
			useChatCommand('magic');
			break;
		case 'setToy':
			useChatCommand(`toy ${command[1]}`);
			break;

		case 'accept':
			acceptInvite();
			break;
		case 'declide':
			declideInvite();
			break;

		case 'playtime':
			useChatCommand('playtime');
			break;
		case 'accountdate':
			useChatCommand('accountdate');
			break;
		case 'playercounts':
		case 'playercount':
		case 'players':
		case 'ponycount':
		case 'ponies':
			useChatCommand('playercounts');
			break;


		//expressions
		case 'smile':
		//case 'happy':
			useChatCommand('happy');
			break;
		case 'frown':
			useChatCommand('frown');
			break;
		case 'sad':
			useChatCommand('sad');
			break;
		case 'angry':
			useChatCommand('angry');
			break;
		case 'think':
		//case 'thinking':
			useChatCommand('thinking');
			break;
		case 'yawn':
			useChatCommand('yawn');
			break;
		case 'laugh':
		// case 'haha':
		// case 'hehe':
		// case 'xaxa':
		// case 'jaja':
		// case 'lol':
		// case 'lmao':
		// case 'giggle':
			useChatCommand('lol');
			break;
		case 'sneeze':
		//case 'achoo':
			useChatCommand('sneeze');
			break;


		//face expressions
		case 'yawn':
			useChatCommand('yawn');
			break;
		case 'sleep':
			useChatCommand('zzz');
			break;
		case 'tears':
			useChatCommand('tears');
			break;
		case 'cry':
			useChatCommand('cry');
			break;
		case 'love':
			useChatCommand('love');
			break;
		case 'blush':
			useChatCommand('blush');
			break;
		case 'kiss':
			useChatCommand('kiss');
			break;


		//collectobles
		case 'gift':
		case 'gifts':
			useChatCommand('gifts');
			break;
		case 'candy':
		case 'candies':
			useChatCommand('candy');
			break;
		case 'egg':
		case 'eggs':
			useChatCommand('eggs');
			break;
		case 'clover':
		case 'clovers':
			useChatCommand('clover');
			break;
		case 'toy':
		case 'toys':
			useChatCommand('toys');
			break;
		case 'pearl':
		case 'pearls':
			useChatCommand('pearls');
			break;


		//funny commands
		case 'yay':
		case 'yay!':
			useChat('yay! ^^');
			break;
			
		case 'echo':
			allowedToSpeak = true;
			addListenToPlayer(commandOwner);
			break;
		case 'stopEcho':
			allowedToSpeak = false;
			break;
		case 'clearEcho':
			sentencesToRepeat = [];
			allowedToSpeak = false;
			break;


		//status
		case 'setStatus':
			switch(command[1]){
				case 'online':
					setStatus('Online');
					break;
				case 'away':
					setStatus('Away');
					break;
				case 'busy':
					setStatus('Busy');
					break;
				case 'chat':
					setStatus('chat');
					break;
				case 'rp':
				case 'roleplay':
					setStatus('roleplay');
					break;
				case 'offline':
				case 'AFK':
					useChatCommand('toy 128');
					break;
				default:
					break;
			}
			break;


		//movement
		case 'up':
		case 'left':
		case 'down':
		case 'right':
			useMovementControls(command[0], command[1]);
			break;


		//body movements, Standing still movements
		case 'turn':
			useChatCommand('turn');
			break;
		case 'fly':
			useChatCommand('fly');
			break;
		case 'stand':
		case 'land':
			useChatCommand('land');
			break;
		case 'sit':
			useChatCommand('sit');
			break;
		case 'lie':
			useChatCommand('lie');
			break;


		//my own commands
		case 'uptime':
		case 'uplink':
			getUptime();
			break;
		case 'stop':
		case 'sthap':
		case 'shutdown':
		case 'offline':
		case 'terminate':
			stop();
			break;
		default:
			//console.log(givenCommand);
			addSentenceToRepeat(commandOwner, givenCommand);
			break;
	}
}

function useChatCommand(command = 'nom'){
	useChat(`/${command}`);
}

function useChat(say = '/nom'){
	document.dispatchEvent(enter);
	document.querySelector('#chat-input').value = say;
	document.querySelector('#chat-input').dispatchEvent(event);
	document.querySelector('#chat-input').value = '';// clears chat so that i can type with a empty chat
	document.querySelector("ui-button[title='Send message']").click();
}

function useMovementControls(direction, time){
	//in the case use movement w d s a
	//w: 87
	//d: 68
	//s: 83
	//a: 65
	if(time > 10){
		time = 10;
	}

	switch(direction){
		case 'up':
			holdKey(87, time);
			break;
		case 'left':
			holdKey(65, time);
			break;
		case 'down':
			holdKey(83, time);
			break;
		case 'right':
			holdKey(68, time);
			break;
		default:
			break;
	}

}

//thanks to https://github.com/aznn/chrome-dino-game-bot/blob/f9b02b66832084d15cf5da2cbec7b5936b87b5aa/script.js#L277
function holdKey(keycode, time = 1){
	if(isNaN(time * 250)){ return; }

	document.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, keyCode: keycode }));
	setTimeout(() => {
		document.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, keyCode: keycode }));
	}, time * 250);
}

function pressKey(keypress, keycode){
	//should keypress by keytype?
	document.dispatchEvent(new KeyboardEvent(keypress, { bubbles: true, cancelable: true, keyCode: keycode }));
}

//acceptGift
function acceptInvite(){
	//btn btn-xs btn-success notification-button
	//document.querySelector("notification-list").click();
}

function declideInvite(){
	//btn btn-xs btn-danger notification-button
	//document.querySelector("notification-list").click();
}

/*
Set status: online, away, busy, rp, roleplay, chat.
AFK.
Offline: sets toy to offline pony.
It will select the right status from the pt list and actives it.
*/
function setStatus(status = 'Online'){
	if(!document.querySelector('.status-box').classList.contains('show')){
		document.querySelector('.status-box .status-button').click();
	}
	const statusItem = document.evaluate(`//button[contains(., "${status}")]`, 
		document.querySelector('.status-box .status-list'), 
		null, 
		XPathResult.FIRST_ORDERED_NODE_TYPE, 
		null).singleNodeValue;
		
	if(statusItem){
		statusItem.click();
	}
}

function pickupCommand(){
	document.dispatchEvent(pickup);
}

function useMagic(){
	useChatCommand('magic');
	isUsingMagic = !isUsingMagic;//this is never water, bullet or fire proof, because we don't know if magic is already one..
}

function addListenToPlayer(player){
	if(player === botName){ return; }

	const index = listenToPlayer.indexOf(player);
	if (index === -1) {
		listenToPlayer.push(player);
	}
}

function removeListenToPlayer(player){
	const index = listenToPlayer.indexOf(player);
	if (index > -1) {
	  listenToPlayer.splice(index, 1);
	}
}

function addSentenceToRepeat(player, sentence){
	const index = sentencesToRepeat.indexOf(player);
	if (index > -1) {
	  sentencesToRepeat.push(sentenc);
	}
}

function getUptime(){
	useChat(`${Math.round(new Date().getTime()/1000) - timeStarted} seconds`);
}

/*
setBotName this is to change bot at run time.
I could listen to pony selector and get the bold name as botName.
*/
//.character-select-list #pony-item-47 .character-name
//aria-expanded="true"
function setBotName(newBotName){
	botName = newBotName;
}

function stop(){
	useChat('shutting down..');
	useChatCommand('e u-u');
	//useChat('');//clears chat.
	console.log('stopping..');
	clearInterval(speak);	
	observer.disconnect();
}