var keys = 4;
var size = 6;
var steps = 5;

var min = 2;
var max = steps;

var pins = new Array(size);
var count = 0;
var pin = 0;
var valid;

var system = {};

function isPinEquals(arr, i){
	return arr[i - 1] === undefined ? false : arr[i - 1] === arr[i];
}

function isStepSizeValid(arr, i){
	return arr[i] >= min && arr[i] <= max;
}

function isStepsValid(arr, i){
	return arr[i - 1] === undefined ? true : Math.abs(arr[i - 1] - arr[i]) <= min;
}

function verify(arr, i){
	if(isPinEquals(arr, i)){
		return false;
	} else if(isStepSizeValid(arr, i) && isStepsValid(arr, i)){
		return true;
	} else {
		return false;
	}
}

function createKey(){
	while(count < pins.length){
		pins[count] = pin;
		valid = verify(pins, count);
		
		while(!valid){
			pins[count]++;
			valid = verify(pins, count);
		}

		count++;
	}
}

function isKeyValid(pins){
	for(var i = 0; i < pins.length; i++){
		if(!verify(pins, i)){
			return false;
		}
	}
	return true;
}

function defineKey(pins){
	var count = 0;
	var pin = 0;

	while(count < pins.length){
		pins[count] = pin;
		valid = verify(pins, count);
		
		while(!valid){
			pins[count]++;
			valid = verify(pins, count);
		}

		count++;
	}

	system[pins.join('')] = pins;
}

function defineKeyFromExists(pins, currentPin){
	if(currentPin <= pins.length - 1){
		pins[currentPin]++;

		if(isKeyValid(pins)){
			return pins;
		} else {
			// pins[currentPin]--;
			return defineKeyFromExists(pins, ++currentPin);
		}
	} else {
		return false;
	}
}

function buildSystem(){
	var isExistMoreKeys = true;
	var pins, index = 0;

	while(isExistMoreKeys){

		var systemKeys = Object.keys(system);
		var keySample = !!systemKeys.length ? systemKeys.length - 1 : 0;
		if(keySample === 0) {
			defineKey(new Array(size));
			index = -1;
		}
		systemKeys = Object.keys(system);
		pins = system[systemKeys[keySample]].slice();

		if(index >= size) index = 0;
		else index++;
		var extendedPins = defineKeyFromExists(pins, index);

		if(!extendedPins){
			index = 0;
			pins = system[systemKeys[keySample]].slice();
			extendedPins = defineKeyFromExists(pins, index);
			isExistMoreKeys = !!extendedPins
		}

		if(isExistMoreKeys){
			if(!system.hasOwnProperty(extendedPins.join(''))){
				system[extendedPins.join('')] = extendedPins;
			}
		}
	}

}

buildSystem();

console.log(system);

var arrLetters = [2,3,4,5];
var comboDepth = 3;
var resString = LoopIt(6, "|", arrLetters);
var result = resString.split('|');
var unique = result.filter(function(item){
	return !!item && isKeyValid(item.split(''));
});

console.log(unique);

function LoopIt(depth, baseString, arrLetters) {
	var returnValue = "";
	for (var i = 0; i < arrLetters.length; i++) {
		returnValue += (depth == 1 ? baseString + arrLetters[i] : LoopIt(depth - 1, baseString + arrLetters[i], arrLetters));
	}
  return returnValue;
}