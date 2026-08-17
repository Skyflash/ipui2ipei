(function () {
  "use strict";

  var fallbackLabels = {
    validationError: "L'IPUI deve contenere almeno 9 caratteri esadecimali.",
    emcHeading: "EMC (16 bit)",
    psnHeading: "PSN (20 bit)",
    hexLabel: "Esadecimale",
    binLabel: "Binario",
    decLabel: "Decimale",
    digitsWord: "cifre",
    finalResultHeading: "Risultato finale",
    ipeiResultLabel: "IPEI",
    checksumHeading: "Checksum (ETSI EN 300 175-6)",
    checksumBaseLabel: "Numero senza il codice di controllo",
    checksumSumLabel: "Somma di cifre",
    checksumModuloLabel: "Modulo",
    checksumStarNote: "Si trasforma in *"
  };
  var labels = window.ipui2ipeiLabels || fallbackLabels;

  function padLeft(str, length) {
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }

  // Checksum ETSI EN 300 175-6 Allegato C: ogni cifra del numero base
  // moltiplicata per la sua posizione (1-based, da sinistra a destra),
  // sommate, modulo 11. Se il risultato è 10, la cifra di controllo
  // diventa "*" invece di un numero.
  function computeChecksum(code) {
    var sum = 0;
    var terms = [];
    for (var i = 0; i < code.length; i++) {
      var term = parseInt(code[i], 10) * (i + 1);
      sum += term;
      terms.push("(" + code[i] + "*" + (i + 1) + ")");
    }
    var modulo = sum % 11;
    var digit = modulo === 10 ? "*" : String(modulo);
    return { sum: sum, modulo: modulo, digit: digit, expression: terms.join(" + ") };
  }

  // Stesso algoritmo dell'implementazione originale, immutato:
  // 1. scarta il primo carattere dell'IPUI
  // 2. EMC = primi 4 caratteri hex (16 bit), PSN = restanti (20 bit)
  // 3. hex -> decimale, zero-padding a 5 cifre (EMC) e 7 cifre (PSN)
  // 4. concatenazione EMC+PSN + cifra di checksum = IPEI finale
  function convert(ipuiInput) {
    var body = ipuiInput.substr(1);

    var emcHex = body.substr(0, 4);
    var emcDec = parseInt(emcHex, 16);
    var emcBin = emcDec.toString(2).toUpperCase();
    var emcDecPadded = padLeft(String(emcDec), 5);

    var psnHex = body.substr(4);
    var psnDec = parseInt(psnHex, 16);
    var psnBin = psnDec.toString(2).toUpperCase();
    var psnDecPadded = padLeft(String(psnDec), 7);

    var base = emcDecPadded + psnDecPadded;
    var checksum = computeChecksum(base);
    var ipei = base + checksum.digit;

    return {
      ipei: ipei,
      emc: { hex: emcHex, bin: emcBin, dec: emcDec, decPadded: emcDecPadded },
      psn: { hex: psnHex, bin: psnBin, dec: psnDec, decPadded: psnDecPadded },
      checksum: checksum
    };
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) {
      el.textContent = text;
    }
  }

  function updateValidationVisual(state) {
    var input = document.getElementById("ipui");
    input.classList.toggle("is-valid", state === true);
    input.classList.toggle("is-invalid", state === false);
  }

  function showValidationMessage(valid) {
    var message = document.getElementById("ipui-message");
    message.textContent = valid ? "" : labels.validationError;
    message.classList.toggle("is-error", !valid);
  }

  function renderVerbose(result) {
    setText("emc-heading", labels.emcHeading);
    setText("emc-hex-label", labels.hexLabel + ":");
    setText("emc-hex", result.emc.hex);
    setText("emc-bin-label", labels.binLabel + ":");
    setText("emc-bin", result.emc.bin);
    setText("emc-dec-label", labels.decLabel + ":");
    setText("emc-dec", String(result.emc.dec));
    setText("emc-dec-padded-label", labels.decLabel + " (5 " + labels.digitsWord + "):");
    setText("emc-dec-padded", result.emc.decPadded);

    setText("psn-heading", labels.psnHeading);
    setText("psn-hex-label", labels.hexLabel + ":");
    setText("psn-hex", result.psn.hex);
    setText("psn-bin-label", labels.binLabel + ":");
    setText("psn-bin", result.psn.bin);
    setText("psn-dec-label", labels.decLabel + ":");
    setText("psn-dec", String(result.psn.dec));
    setText("psn-dec-padded-label", labels.decLabel + " (7 " + labels.digitsWord + "):");
    setText("psn-dec-padded", result.psn.decPadded);

    setText("checksum-heading", labels.checksumHeading);
    setText("checksum-base-label", labels.checksumBaseLabel + ":");
    setText("checksum-base", result.emc.decPadded + result.psn.decPadded);
    setText("checksum-sum-label", labels.checksumSumLabel + ":");
    setText("checksum-sum", result.checksum.expression + " = " + result.checksum.sum);
    setText("checksum-modulo-label", labels.checksumModuloLabel + ":");
    var moduloText =
      result.checksum.modulo === 10
        ? "10 (" + labels.checksumStarNote + ")"
        : String(result.checksum.modulo);
    setText("checksum-modulo", moduloText);

    setText("final-result-heading", labels.finalResultHeading);
    setText("final-ipei-label", labels.ipeiResultLabel);
    setText(
      "final-ipei",
      result.emc.decPadded + " " + result.psn.decPadded + " " + result.checksum.digit
    );
  }

  function handleInput() {
    var value = document.getElementById("ipui").value;
    if (value.length === 0) {
      updateValidationVisual(null);
      showValidationMessage(true);
      return;
    }
    updateValidationVisual(value.length >= 9);
  }

  function handleConvert() {
    var value = document.getElementById("ipui").value;

    if (value.length < 9) {
      updateValidationVisual(false);
      showValidationMessage(false);
      return;
    }
    updateValidationVisual(true);
    showValidationMessage(true);

    var result = convert(value);
    document.getElementById("ipei").value = result.ipei;

    var panel = document.getElementById("verbose-panel");
    if (document.getElementById("verbose").checked) {
      renderVerbose(result);
      panel.hidden = false;
    } else {
      panel.hidden = true;
    }
  }

  function handleReset() {
    location.reload();
  }

  function init() {
    var ipuiField = document.getElementById("ipui");
    var form = document.getElementById("converter-form");
    var resetBtn = document.getElementById("reset-btn");

    // Il bottone Converti è type="submit": premendo Invio nel campo IPUI
    // il browser invia il form da solo, senza bisogno di gestire il tasto
    // a parte. preventDefault evita il refresh della pagina.
    if (ipuiField) ipuiField.addEventListener("input", handleInput);
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        handleConvert();
      });
    }
    if (resetBtn) resetBtn.addEventListener("click", handleReset);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
