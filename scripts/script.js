$(document).ready(function () {
  let selectedCards = [];
  let matchedCards = [];
  let failures = 0;
  let currentSize = 6;

  function generateBoard(size) {
    currentSize = size;
    const $board = $("#boardGame");
    $board.empty().removeClass().addClass(`board-game size-${size}`);
    $("#failures").text("Fails: 0");
    failures = 0;
    selectedCards = [];
    matchedCards = [];

    createRestartButton();

    // hacer las parejas
    let cardValues = [];
    for (let i = 1; i <= size / 2; i++) {
      cardValues.push(i, i);
    }

    // aleatorizar posicion
    cardValues = cardValues.sort(() => 0.5 - Math.random());

    // generar cartas
    cardValues.forEach((val) => {
      const $card = $(`
        <div class="card" data-value="${val}">
          <div class="card-inner">
            <div class="card-front">?</div>
            <div class="card-back">${val}</div>
          </div>
        </div>
      `);
      $board.append($card);
    });
  }

  function resetTurn() {
    selectedCards.forEach(($c) => $c.removeClass("flipped"));
    selectedCards = [];
  }

  function createRestartButton() {
    if ($("#restartButton").length > 0) return;

    const $btn = $(
      `<button id="restartButton" class="restart-button">Restart</button>`
    );
    $btn.insertAfter("#failures");

    $btn.on("click", function () {
      generateBoard(currentSize);
    });
  }

  $("#difficulty").on("change", function () {
    const size = parseInt($(this).val());
    generateBoard(size);
  });

  $("#boardGame").on("click", ".card", function () {
    const $card = $(this);

    if (
      $card.hasClass("flipped") ||
      $card.hasClass("matched") ||
      selectedCards.length >= 2
    ) {
      return;
    }

    $card.addClass("flipped");
    selectedCards.push($card);

    if (selectedCards.length === 2) {
      const val1 = selectedCards[0].data("value");
      const val2 = selectedCards[1].data("value");

      if (val1 === val2) {
        // acierto
        selectedCards.forEach(($c) => $c.addClass("matched"));
        matchedCards.push(val1);
        selectedCards = [];
      } else {
        // fallo
        failures++;
        setTimeout(() => {
          $("#failures").text(`Fails: ${failures}`);
        }, 1500);
        $("#boardGame").addClass("disabled");

        setTimeout(() => {
          resetTurn();
          $("#boardGame").removeClass("disabled");
        }, 1000);
      }
    }
  });

  // generar tablero al cargar la página
  const initialSize = parseInt($("#difficulty").val()) || 6;
  generateBoard(initialSize);
});
