$(function () {
  let lang = "mk";
  const periodicTableLang = {
    en: Elements,
    mk: ElementsMK,
  };

  // Sound button

  let clicked = false;
  $(".on").hide();
  $(".sound").on("click", (e) => {
    e.preventDefault();

    if (!clicked) {
      clicked = true;
      $(".on").show();
      $(".off").hide();
      let audio = $("#audio")[0];
      audio.play();
      $(".table").on("mouseover", function () {
        audio.play();
      });
    } else {
      clicked = false;
      $(".off").show();
      $(".on").hide();
      $(".table").on("mouseover", function () {
        audio.pause();
      });
    }
  });

  // creating card

  function CreateCard(obj) {
    return `<a class="element color${obj.category.replace(
      " ",
      "-"
    )}" href="#${obj.number ? `${obj.number}` : ""}">

    <h3>${obj.symbol}</h3>
    <p>${obj.name}</p>
    <span class="f-size">${
      obj.number ? `<span>${obj.number}</span>` : ""
    }</span>
    <ul class="leftSpan">${obj.shells
      .map((s) => {
        return `<li>${s}</li>`;
      })
      .join("")} </ul>
    </a>
  `;
  }
  // language button

  $(".text").hide();
  $(".mk").on("click", (e) => {
    e.preventDefault();
    if ($(".mktext").is(":visible")) {
      $(".en").addClass("opened");
      $(".mkflag").hide();
      $(".enflag").show();
    }
    if ($(".text").is(":visible")) {
      $(".en").addClass("opened");
      $(".mkflag").show();
      $(".enflag").hide();
    }
  });
  $(".en").on("click", (e) => {
    e.preventDefault();
    if ($(".enflag").is(":visible")) {
      lang = $(".en").attr("id");
      $(".text").show();
      $(".mktext").hide();
      $(".en").removeClass("opened");
    }
    if ($(".mkflag").is(":visible")) {
      lang = $(".mk").attr("id");
      $(".mktext").show();
      $(".text").hide();
      $(".en").removeClass("opened");
    }
    translateAll();
    renderSingleElement();
  });

  // function for translating
  function translateAll() {
    createTable();
    createBottomTable();
    $(".t").each(function (idx, element) {
      const key = $(this).attr("key");

      const hasPlaceholder = $(this).attr("placeholder");

      if (hasPlaceholder) {
        $(this).attr("placeholder", customLang[lang][key]);
      } else {
        $(this).text(customLang[lang][key]);
      }
    });
  }
  // creating top table
  const table = $(".topTable");
  const createTable = () => {
    table.empty();
    for (let i = 1; i <= 18; i++) {
      table.append(createColumn(i));
    }
  };

  // creating column
  const createColumn = (idx) => {
    const divContainer = $("<div/>");
    const colLabel = $("<h3/>");
    colLabel.text(idx).addClass("icon");
    let arrow = $("<div/>");
    arrow.addClass("arrow-down");
    colLabel.append(arrow);
    divContainer.append(colLabel);
    divContainer.addClass("periodic-column");

    colLabel.on("click", function () {
      $(".frame").attr("src", iframeUrls[lang][idx - 1]);
      $(".modal").addClass("open");
    });

    //itterate over all elements
    periodicTableLang[lang].map((item) => {
      if (item.xpos === idx) {
        divContainer.append(CreateCard(item));
      }
    });

    // return some html from createCard
    return divContainer;
  };
  // create bottom table
  let table1 = $(".bottomTable");
  const createBottomTable = () => {
    table1.empty();
    createRow();
  };
  // create row bottom
  let createRow = () => {
    const divContainer = $("<div/>");
    const divContainer2 = $("<div/>");
    divContainer.addClass("periodic-row");
    divContainer2.addClass("periodic-row");
    let left = $("<span/>");
    left.addClass("t left1");
    left.attr("key", "elements");
    divContainer.prepend(left);
    let left1 = $("<span/>");
    left1.addClass("t left2");
    left1.attr("key", "paragraph");
    divContainer2.prepend(left1);
    table1.append(divContainer);
    table1.append(divContainer2);
    periodicTableLang[lang].map((item) => {
      if (item.xpos === "down") {
        divContainer.append(CreateCard(item));
      } else if (item.xpos === "sdown") {
        divContainer2.append(CreateCard(item));
      }
    });
    return divContainer, divContainer2;
  };
  createBottomTable();

  translateAll();
  createTable();

  // close modal

  $(".close").on("click", function () {
    $(".modal").removeClass("open");
  });

  // Search

  let searchIcon = $(".search");
  let searchInput = $("#searchInput");
  let suggest = $(".suggestions");
  let suggest2 = $(".suggestions2");

  searchIcon.on("click", () => {
    $(".searchArea").slideDown();
    $(".overlay").slideDown();
  });

  searchInput.on("keyup", () => {
    let userData = searchInput.val().toLowerCase();

    if (userData) {
      let emptyArray = periodicTableLang[lang].filter((data) => {
        let n = data.name.toLowerCase();
        let symb = data.symbol.toLowerCase();
        let subSymbol = symb.substring(0, userData.length);
        let subName = n.substring(0, userData.length);
        if (subSymbol === userData || subName === userData) {
          return data;
        }
      });

      emptyArray.forEach((element) => {
        $(".suggestions").append(
          `<li><a href="#${element.number}">${element.symbol}</a></li>`
        );
        $(".suggestions2").append(
          `<li><a href="#${element.number}">${element.name}</a></li>`
        );
      });
    } else {
      suggest.empty();
      suggest2.empty();
    }
  });

  // overlay search close

  $(".overlay .close").on("click", () => {
    $(".overlay").slideUp();
  });

  // about page open and close

  $(".dot").on("click", () => {
    $(".aboutPage").addClass("aboutOpen");
  });
  $(".aboutPage .close").on("click", () => {
    $(".aboutPage").removeClass("aboutOpen");
  });

  // function for creating details page

  function renderSingleElement() {
    let number = location.hash.replace("#", "");
    let singleElement = periodicTableLang[lang].find(function (r) {
      return r.number == number;
    });
    let elTop = $(".elementTop");
    let elTopR = $(".elementTopRight");
    let elBottom = $(".elementBottom");

    let leftImg = $("<div></div>").addClass("leftimg");
    elTop.empty();
    elTopR.empty();
    elBottom.empty();

    // top left element

    let elementContainer = $("<div></div>");
    elementContainer.addClass("singleElement");
    let h3 = $("<h3></h3>");
    h3.text(singleElement.symbol);
    let span = $("<span></span>");
    span.text(singleElement.number).addClass("topleftSpan");
    let ul = $("<ul></ul>");
    ul.html(
      singleElement.shells
        .map((s) => {
          return `<li>${s}</li>`;
        })
        .join("")
    );
    let mass = $("<span></span>");
    mass
      .text(singleElement.atomic_mass.toFixed(3) || "N/A")
      .addClass("leftMass");
    let h2 = $("<h2></h2>");
    h2.text(singleElement.name).addClass("name", "t");

    // left top information properties

    const lis = $(".information .props");

    lis.each(function (idx, element) {
      const prop = $(this).attr("id");

      if (prop === "atomic_mass") {
        $(this).text(
          singleElement[prop] ? singleElement[prop].toFixed(2) : "N/A"
        );
      } else if (prop === "density") {
        $(this).text(
          singleElement[prop]
            ? singleElement[prop].toFixed(2) + " " + "g/cm3"
            : "N/A"
        );
      } else if (prop === "melt" || prop === "boil") {
        $(this).text(
          singleElement[prop]
            ? singleElement[prop].toFixed(2) + " " + "°C"
            : "N/A"
        );
      }
    });

    // summary

    let dots = $("<div></div>");
    dots.addClass("dots");
    let i = $(`<i class="fas fa-ellipsis-h"></i>`);
    let paragraph1 = $("<p></p>");
    paragraph1.text(singleElement.summary);
    let h4 = $("<h4></h4>");
    h4.addClass("t").attr("key", "details");
    let i1 = $(`<i class="fas fa-file-pdf"></i>`);

    //Create bottom image and carousel

    let img = $(
      `<img id="${singleElement.staticImage.id}" src="${singleElement.staticImage.src}" alt="${singleElement.staticImage.alt}"></img>`
    );

    // create Carousel
    let carouselInner = $(".carousel-inner");
    carouselInner.empty();
    singleElement.images.map((el) => {
      let cImg = $(
        `<div class="carousel-item" data-interval="2000"><img src="${el.src}" style="d-block"></div>`
      );
      carouselInner.append(cImg);
    });

    $(".carousel-item").first().addClass("active");

    // right properties and values for the element

    let uls = $(".rightDetails .values");
    uls.each(function (idx, el) {
      const property = $(this).attr("id");
      if (property === "density") {
        $(this).text(
          singleElement[property]
            ? singleElement[property] + " " + "g/cm3"
            : "N/A"
        );
      } else if (property === "melt" || property === "boil") {
        $(this).text(
          singleElement[property]
            ? singleElement[property].toFixed(2) + " " + "°C"
            : "N/A"
        );
      } else if (property === "halflife" || property === "lifetime") {
        $(this).text(
          singleElement[property]
            ? singleElement[property].toFixed(2) + " " + "y"
            : "N/A"
        );
      } else if (property === "electron_affinity") {
        $(this).text(
          singleElement[property]
            ? singleElement[property].toFixed(2) + " " + "kJ/mol"
            : "N/A"
        );
      } else if (property === "ionization_energies") {
        $(this).text(
          singleElement[property] ? singleElement[property].slice(0, 3) : "N/A"
        );
      } else {
        $(this).text(singleElement[property] || "N/A");
      }
    });

    // appending elements
    elementContainer.append(h3, span, ul, mass);
    elTop.append(elementContainer);
    elTop.append(h2);
    elTopR.append(dots);
    elTopR.append(paragraph1, i1, h4);
    dots.append(i);
    leftImg.append(img);
    elBottom.append(leftImg);
    translateAll();
  }

  // routing

  function handleRoute() {
    let hash = location.hash;
    console.log(hash);
    if (hash === "") {
      $(".homePage").show();
      $(".DetailsPage").hide();
    } else {
      $(".homePage").hide();
      $(".DetailsPage").css({ display: "flex" });
      renderSingleElement();
    }
  }

  $(".DetailsPage .close").on("click", () => {
    $(".DetailsPage").css({ display: "none" });
    $(".DetailsPage .close").attr("href", "#");
    $(".homePage").show();
    $(".overlay").css({ display: "none" });
    suggest.empty();
    suggest2.empty();
    searchInput.val("");
  });

  $(window).on("hashchange", handleRoute);
  handleRoute();

  // media

  $(window).on("orientationchange", () => {
    if ($(window).height() < $(window).width()) {
      $(".mobile").css({ display: "block" });
    } else {
      $(".mobile").css({ display: "none" });
    }
  });
});
