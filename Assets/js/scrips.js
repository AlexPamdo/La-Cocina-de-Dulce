$(document).ready(function () {
  //Funcion para mostrar recetas en el html
  function mostrarReceta(recetas) {
    recetas.forEach((meal) => {
      //este pedacito de codigo es para acceder al arrayd o objeto que contiene los ingredientes a los que vamos a ir registrando en una variable mediante un for, todo esto para
      //poder mostrarlas luego
      let ingredientes = "";
      for (let i = 1; i <= 20; i++) {
        let ingrediente = meal[`strIngredient${i}`];
        if (ingrediente) {
          ingredientes += `<li>${ingrediente}</li>`;
        }
      }

      //aqui se crea el html para cada receta, y se agrega a la zona de recetas
      let receta = `<div class="receta">
                          <div class="receta-container">
                               <div>
                                  <h3>${meal.strMeal}</h3>
                                   <div class="receta-img-ingredientes">
                                    <img src="${meal.strMealThumb}" width="300px">
                                      <div class="ingredientes-container">
                                          <ul class="ingredientes">
                                       <h2>Ingredientes</h2>
                                          ${ingredientes}
                                          </ul>
                                      </div>
                                   </div>
                                  <p><strong>Categoría:</strong> ${meal.strCategory}</p> <!-- Aquí mostramos la categoría -->
                                </div>
                               
                          </div>
                          <div class="btn-container">
                              <input type="hidden" value="${meal.idMeal}">
                              <button class="btn btn-ingredientes">Ingredientes</button>
                              <button class="btn btn-preparacion">Preparacion</button>
                          </div>
                      </div>
                       `;

      //una pequeño efecto para que no sea tan brusca la aparicion
      $("#recetas").append(receta).hide().fadeIn(300);
    });
  }

  // ----------------------------------------------------------------
  // Buscar una receta en el buscador
  $("#buscarReceta").keyup(function (event) {
    //Vamos llenando la variable con lo que se va escribiendo en el input
    nombrePlatillo = $(this).val();

    //Si el input esta vacio limpiara la zona donde se ven las recetas
    if (nombrePlatillo.trim() === "") {
      $("#recetas").empty();
      return;
    }

    //aqui ya empezamos con las funciones asincronas, en este caso "fech" para ir obteniendo las recetas que vayan coinciediendo con lo digitado en el input
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${nombrePlatillo}`
    )
      //si la promesa del fetch fue exitosa vamos a convertir los datos que retorno a un formato "json"
      .then((response) => response.json())

      //y luego de esa promesa usamos los datos convertidos en json, ahora llamados data para mosrtrar las recetas encontradas
      .then((data) => {
        //limpiamos la zona de las recetas de busquedas anteriores para evitar que se acumulen
        $("#recetas").empty();

        //Verificamos si hay recetas disponibles dentro de data
        if (data.meals) {
          //Utilizamos nuestra funcion para mostrar las recetas obtenidas en el html
          mostrarReceta(data.meals);
        } else {
          console.log("No se encontró el platillo.");
        }
      })
      .catch((error) => console.error("Error:", error));
  });

  // ----------------------------------------------------------------
  // Generar recetas ramdon
  // Funciones para generar alguna receta ramdon al pulsar el boton
  $(".btn-sorprendeme").click(function (event) {
    //aqui ya empezamos con las funciones asincronas, en este caso se genera una ramdon por el tipo de endpoint
    fetch("https://www.themealdb.com/api/json/v1/1/random.php")
      .then((response) => response.json())

      //de aca para abajo es practicamente lo mismo que lo de arrba
      .then((data) => {
        $("#recetas").empty();
        if (data.meals) {
          mostrarReceta(data.meals);
        } else {
          console.log("No se encontró el platillo.");
        }
      })
      .catch((error) => {
        console.error("Error al obtener la receta:", error);
        alert("Hubo un problema al obtener la receta. Intenta nuevamente.");
      });
  });

  // ----------------------------------------------------------------
  // Mostrar los ingredientes de la receta al pulsar el boton

  //aqui basicamente estamos diciendo que todos los elemento del dom que puedan contener la clase ".btn-ingredientes" podran usar la funcion, esto se hace asi
  //para que al momento de generar nuevas recetas el boton pueda funcionar
  $(document).on("click", ".btn-ingredientes", function () {
    //Buscamos el contenedor de la receta que contiene los ingredientes
    listaIngredientes = $(this).closest(".receta").find(".ingredientes");

    //Si la lista de ingredientes esta visible la ocultamos y desaparece, sino la mostramos y aparece
    if (listaIngredientes.is(":visible")) {
      listaIngredientes.hide();
      listaIngredientes.css("opacity", "0");
    } else {
      listaIngredientes.css("display", "flex");
      listaIngredientes.show();
      listaIngredientes.css("opacity", "1");
    }
  });

  // ----------------------------------------------------------------
  // Mostrar la preparacion de la receta cuando el usuario haga clic en el botón
  //Hacemos lo mismo que mencionamos en la anterior funcion para que puedan funcionar todos los botones que puedan aparecer
  //para mostrar la receta
  $(document).on("click", ".btn-preparacion", function () {
    //buscamos el input oculto que guarda el id de la receta
    recetaBuscada = $(this).closest("div").find("input").val();
    console.log(recetaBuscada);

    //y luego accedemos al fecth con el endpoint para buscar una receta mediante su id y ponemos la variable con el id de la receta
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recetaBuscada}`
    )
      //vamos haciendo las promesas para obtener nuestros datos deseados
      .then((response) => response.json())
      .then((data) => {
        data.meals.forEach((meal) => {
          console.log("Instrucciones:", meal.strInstructions);
          //Y unicamente vamos a obtener la receta y el nombre para pegarlos en nuestro side
          $("#nombreReceta").html(meal.strMeal);
          $("#instruccion").html(meal.strInstructions);
        });
      })
      .catch((error) => console.error("Error:", error));
    //esto es para que el side pueda aparecer
    $("#side-preparacion").css("width", "57vh");
  });

  //cerrar side (boton)
  $("#cerrar-side").click(function (event) {
    $("#side-preparacion").css("width", "0");
  });

  //cerrar side (click fuera)
  $(window).click(function (event) {
    if (
      !$(event.target).closest("#side-preparacion").length &&
      !$(event.target).closest(".btn-preparacion").length
    ) {
      $("#side-preparacion").css("width", "0");
    }
  });
});
