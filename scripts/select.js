$(document).ready(function () {
  const levels = {
    easy: { cards: 8 },
    normal: { cards: 16 },
    hard: { cards: 24 },
    very_hard: { cards: 32 },
  };

  const $difficultySelect = $("#difficulty");
  const $customTrigger = $("#customTrigger");
  const $customOptions = $("#customOptions");
  const $customSelect = $("#customSelect");

  $customOptions.hide(); // Oculta el menú de opciones al cargar

  // Inicializar custom select
  function initCustomSelect() {
    $difficultySelect.empty();
    $customOptions.empty();

    $.each(levels, (key, value) => {
      const formattedName = key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const text = `${formattedName} (${value.cards} cartas)`;

      // Opción para el <select> real
      $("<option>")
        .val(value.cards)
        .text(text)
        .appendTo($difficultySelect);

      // Opción visual del custom select
      $("<div>")
        .addClass("custom-option")
        .attr("data-value", value.cards)
        .text(text)
        .on("click", function () {
          const selectedValue = $(this).data("value");

          $difficultySelect.val(selectedValue); // sincronzar select real
          $customTrigger.text($(this).text()); // actualizar trigger visible
          $customOptions.slideUp(); // cerrar opciones

          // Generar nuevo tablero
          $difficultySelect.trigger("change");
        })
        .appendTo($customOptions);
    });

    $customTrigger.text("Choose Level");
  }

  // Toggle opciones al hacer click en el trigger
  $customTrigger.on("click", function (e) {
    e.stopPropagation();
    $customOptions.slideToggle();
  });

  // Cerrar si haces click fuera del custom select
  $(document).on("click", function (e) {
    if (!$(e.target).closest($customSelect).length) {
      $customOptions.slideUp();
    }
  });

  // Inicializar al cargar
  initCustomSelect();
});
