ipui = document.getElementById('ipui');

function keyPressHandle(e) {
  	var char = String.fromCharCode(e.charCode), 
    target = e.target,
    inputVal = target.value,

    value = inputVal.substr(0, target.selectionStart) + char + inputVal.substr(target.selectionEnd); 
    ipuiLength = ipui.value.length + 1;

  	if (ipuiLength < 9) {
  		visualValidation(false, target);
 	} else {
 		visualValidation(true, target);
 	}   
}

function keyUpHandle(e) {
  var target = e.target,
      keyCode = e.keyCode;

  if (keyCode === 8 || keyCode === 46) {
  	ipuiLength = ipui.value.length;
    if(ipuiLength < 9) {
      visualValidation(false, target);
    } else {
      visualValidation(true, target);
    }
  }
}

function visualValidation(valid, target) {
	if (valid === true) {
		document.getElementById("ipui-group").className = "form-group has-success has-feedback"
		document.getElementById("ipuiVal").className = "glyphicon form-control-feedback glyphicon-ok"
	} else {
		document.getElementById("ipui-group").className = "form-group has-error has-feedback"
		document.getElementById("ipuiVal").className = "glyphicon form-control-feedback glyphicon-remove"
	}
}

ipui.onkeypress = keyPressHandle;
ipui.onkeyup = keyUpHandle;

function calculate(){
	ipui = document.getElementById("ipui").value

	if (ipui.length < 9) {
		alert("ERRORE: L'IPUI deve contenere almeno 9 caratteri esadecimali.")
	}

	ipui = ipui.substr(1)

	ipuiFirst = ipui.substr(0,4)
	vipuiFirstHex = ipuiFirst;

	ipuiFirst = parseInt(ipuiFirst, 16)
	vipuiFirstDec = ipuiFirst
	vipuiFirstBin = vipuiFirstDec.toString(2).toUpperCase();

	ipuiFirst = ipuiFirst.toString()

	while (ipuiFirst.length < 5) {
		ipuiFirst = "0" + ipuiFirst
	};
	vipuiFirstBinComplete = ipuiFirst

	ipuiLast = ipui.substr(4)
	vipuiLastHex = ipuiLast;

	ipuiLast = parseInt(ipuiLast, 16)
	vipuiLastDec = ipuiLast
	vipuiLastBin = vipuiLastDec.toString(2).toUpperCase();

	ipuiLast = ipuiLast.toString()

	while (ipuiLast.length < 7) {
		ipuiLast = "0" + ipuiLast;
	};
	vipuiLastBinComplete = ipuiLast

	ipei = ipuiFirst + ipuiLast

	ipei = ipei + checksum(ipei);

	document.getElementById("ipei").value = ipei

	if (document.getElementById("verbose").checked) {
		document.getElementById("verboseBox").className = "show";
		document.getElementById("verboseContent").innerHTML = "<br><b>EMC (16 bits)</b><br>EMC Esadecimale: " + vipuiFirstHex + "<br>EMC Binario: " + vipuiFirstBin + "<br>EMC Decimale: " + vipuiFirstDec + "<br>EMC Binario (5 cifre): " + vipuiFirstBinComplete + "<br><br><b>PSN (20 bits)</b><br>PSN Esadecimale: " + vipuiLastHex + "<br>PSN Binario: " + vipuiLastBin + "<br>PSN Decimale: " + vipuiLastDec + "<br>PSN Decimale (7 cifre): " + vipuiLastBinComplete;

		document.getElementById("verboseContentFinal").innerHTML = "<br><b>Risultato finale</b><br>IPEI: " + vipuiFirstBinComplete + " " + vipuiLastBinComplete + " " + vcheckDigitFinal;
	};
};


/* Calcolo del codice di controllo secondo l'ETSI (EN 300 175-6 - Allegato C).
   Ogni cifra viene moltiplicata per il numero della sua posizione, da sinistra
   a destra, a partire dal 1. */

function checksum(code) {
	var checkDigit = 0
	var vcheckDigit = ""
	for (var i = 0; i < code.length; i++) {
		checkDigit = checkDigit + (parseInt(code[i]) * (i + 1))
		if (document.getElementById("verbose").checked){
			if (i == 0) {
				vcheckDigit = "(" + code[i] + "*" + (i + 1) + ")"
			} else {
				vcheckDigit = vcheckDigit + " + " + "(" + code[i] + "*" + (i + 1) + ")"
			};
		};
	};
	vcheckDigitNoMod = checkDigit
	checkDigit = checkDigit % 11;
	vcheckDigitFinal = checkDigit;

	if (checkDigit == 10) {
		checkDigit = "*"
		vcheckDigitFinal = "10 (Si trasforma in *)"
	};
	
	if (document.getElementById("verbose").checked) {
		document.getElementById("verboseContentChecksum").innerHTML = "<br><b>Checksum (ETSI EN 300 175-6)</b><br>Numero senza il codice di controllo: " + code + "<br>Somma di cifre: " + vcheckDigit + " = <b>" + vcheckDigitNoMod + "</b><br>Modulo: " + vcheckDigitNoMod + " mod 11 = " + vcheckDigitFinal;	
	};

	return checkDigit
};