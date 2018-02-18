//Render company information

//Brand logo
$(".navbar-brand, .footer__brand").html(`<img class="brand-logo" src="${companyInfo.brandLogo}">`);

//Telephone number
$(".footer__contacts--list, .header__top--contacts ul").append(`<li><a href="#"><i class="fas fa-phone"></i>${companyInfo.telephoneNumber}</a></li>`);

//Email
$(".footer__contacts--list, .header__top--contacts ul").append(`<li><a href="#"><i class="fas fa-envelope"></i>${companyInfo.email}</a></li>`);

// //Social media
//Facebook
$(".footer__social-media--icons, .header__top--social ul").append(`<li><a href="${companyInfo.facebook}"><i class="fab fa-facebook-f"></i></a></li>`);
//Twitter
$(".footer__social-media--icons, .header__top--social ul").append(`<li><a href="${companyInfo.twitter}"><i class="fab fa-twitter"></i></a></li>`);
//Linkedin
$(".footer__social-media--icons, .header__top--social ul").append(`<li><a href="${companyInfo.linkedin}"><i class="fab fa-linkedin-in"></i></a></li>`);
//Google-plus
$(".footer__social-media--icons, .header__top--social ul").append(`<li><a href="${companyInfo.googlePlus}"><i class="fab fa-google-plus-g"></i></a></li>`);



// Render product grid
for (let i = 0; i < products.length; i++) {
  $(".main-section__products").append(`
        <div class="product show ${products[i].category} col-1-of-4" id="#${products[i].price}" dataKeyword=${products[i].dataKeyword}>
          <div class="product-content">
            <div class="product-image">
              <img src="${products[i].image}">
            </div>
            <div class="product-details">
              <ul class="product-details--list">
                <li class="product-name">${products[i].name}</li>
                <li>${products[i].details2}</li>
                <li>${products[i].details3}</li>
                <li class="price">${products[i].price} €</li>
              </ul>
              <div class="product-details--buttons">
                <a href="#" class="product-btn shopping-cart"><i class="fas fa-shopping-cart"></i> Į Krepšelį</a>
                <a href="#" class="product-btn"><i class="far fa-heart"></i></a>
              </div>
            </div>
          </div>
        </div>
    `);
}


//Render Categories
for (let i = 0; i < categories.length; i++) {
  $(".categorie-list, .sidebar__categories--list, .footer__navigation--categories").append(`
    <li class="category"><a href="#" class="categories-filter" value="${categories[i].categoryKeyword}" >${categories[i].categoryName}</a></li>
    `);
}


// Set products per page (12 by default)
var limitPerPage = Number($('.products-per-page-dropdown :selected').attr("value"));

//Number of items to show
var numberOfItems = $(".show").length;

// Generate products (12 by default) per page and set pagination according to it
generatePagination();

//Show in toolbar how many products there is that matches searched term/filters
countItems();

//Navigating through pagination on click
function goToPage() {

    $(".page-number").on("click", function(){

        //Dont do anything if clicked on active page
        if ($(this).hasClass("active")){
            return false;
        } else {
              //Else go to the clicked page
              var currentPage = $(this).index()+1;
              $(".pagination li").removeClass("active");
              $(this).addClass("active");

              var paginationList = $(".pagination-list");
              console.log(paginationList.length);
              var pageIndex = $(this).index();
              console.log(pageIndex);

              for (var i=0; i < paginationList.length; i++){
                  paginationList.eq(i).find("li").eq(pageIndex).addClass('active').siblings().removeClass('active');
              }

              $(".product").hide();

              //Decide which products to show on which page
              var total = limitPerPage * currentPage;

              for (let i = total - limitPerPage; i < total; i++) {
                $(`.show:eq(${i})`).show();

              }

        }
    });
}


// Generate pagination according to shown products
function generatePagination() {

    //Remove all earlier pagination to generate new
    $(".page-item").remove();


    //If there is no products to show there is no need to generate pagination
    if (numberOfItems < 1) return false;

    //Hide products that exceeds the limit per page mark
    $(`.show:gt(${limitPerPage-1})`).hide();

    //Count number of pages needed
    var totalPages = Math.ceil(numberOfItems / limitPerPage);

    //Append first page which is active on default
    $(".pagination-list").append(`<li class='page-item page-number active first-page'><a class='page-link' href='#'>1</a></li>`);

    //Append ass much pages as needed according to products to show
    for (let i = 2; i <= totalPages; i++) {
      $(".pagination-list").append(`<li class='page-item page-number'><a class='page-link' href='#'>${i}</a></li>`);
    }


    //Navigating through pagination on click
    goToPage();

}

//Re-evalute on dropdown changes

$(".products-per-page-dropdown").on("change", function(){

  limitPerPage = Number($('.products-per-page-dropdown :selected').attr("value"));
  $(".product").hide();
  $(".show").show();
  // generatePagination according to selected products per page limit
  numberOfItems = $(".show").length;
  generatePagination();
  countItems();

});

// Re-evalute on search changes

$("#search").on("input", function(){

  $(".categories-filter").removeClass("active");
  $(".show-all").addClass("active");

  var current_query = $("#search").val().toLowerCase().replace(/[-|\s]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  if (current_query != ""){
    $(".product").removeClass("show");
    $(".product").hide();

    $(".product").each(function(){


      //Turn products data keyword into lower case and turn diacritics into simple characters
      var current_keyword = $(this).attr("dataKeyword").toLowerCase().replace(/[-|\s]/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, "");


        if (current_keyword.includes(current_query)) {
            $(this).show();
            $(this).addClass("show");

            numberOfItems = $(".show").length;
            countItems();

        } else {
            numberOfItems = $(".show").length;
            countItems();
        }
    });
  } else {
      $(".product").addClass("show");
      $(".show").show();

      numberOfItems = $(".show").length;

    }

    generatePagination();
    countItems();

});

$(".categories-filter").on("click", function(){

    $("#search").val("");

    $(".product").removeClass("show");
    $(".product").hide();

    $(".categories-filter").removeClass("active");
    $(this).addClass("active");


    if ($(this).attr("value") == "show-all") {

      $(".product").addClass("show");
      $(".show").show();

      numberOfItems = $(".show").length;

      generatePagination();
      countItems();


    } else {


        var filterCategory = $(this).attr("value");

        $("."+filterCategory).addClass("show");
        $(".show").show();

        numberOfItems = $(".show").length;

      generatePagination();

      countItems();

      goToPage();

    }
});

function countItems(){
  var totalProducts = $(".show").length;
  $(".total-items").text(totalProducts+" Produktas(-ų)");
}
