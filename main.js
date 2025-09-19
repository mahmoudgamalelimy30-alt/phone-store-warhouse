let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let inputs = [title, price, taxes, ads, discount, count, category];
let submit = document.getElementById("submit");
let submitMood = "create";
let indexOfUpdate;
let searchMood = "title";

let search = document.getElementById("search");
let byTitle = document.getElementById("byTitle");
let byCategory = document.getElementById("byCategory");

inputs.forEach((input) => {
  input.addEventListener("input", function () {
    if (this.value.trim() != "") {
      this.classList.remove("error");
    }
  });
});

//get total price
function getTotalPrice() {
  if (price.value != "") {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    total.style.backgroundColor = "rgba(0, 255, 145, 0.28)";
  } else {
    total.innerHTML = "";
    total.style.backgroundColor = "rgba(255, 0, 0, 0.277)";
  }
}

//create pdt
let dataPro;
if (localStorage.product) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

submit.onclick = function () {
  // للتأكد من الحقول الفارغة

  let emptyField = inputs.find((input) => input.value.trim() === "");

  if (emptyField) {
    emptyField.focus();
    emptyField.classList.add("error");
    return;
  } else {
    inputs.forEach((input) => {
      input.addEventListener("input", function () {
        if (this.value.trim() != "") {
          this.classList.remove("error");
        }
      });
    });
  }

  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };
  if (submitMood === "create") {
    dataPro.push(newPro);
  } else {
    dataPro[indexOfUpdate] = newPro;
    submit.innerHTML = "Create";
    submitMood = "create";
  }

  //save local storage
  localStorage.setItem("product", JSON.stringify(dataPro));
  clearData();
  showData();
};

//clear inputs after create
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  getTotalPrice();
  count.value = "";
  category.value = "";
}

// read
function showData() {
  let table = "";
  let totalItemNum = 0;
  for (let i = 0; i < dataPro.length; i++) {
    totalItemNum += +dataPro[i].count;
    table += `
    <tr>
              <td>${i + 1}</td>
              <td>${dataPro[i].title}</td>
              <td>
                ${dataPro[i].total}
                <span class="tooltip">
                  ℹ
                  <span class="tooltiptext">
                    price: ${dataPro[i].price} <br />
                    taxes: ${dataPro[i].taxes} <br />
                    ads: ${dataPro[i].ads} <br />
                    discound: ${dataPro[i].discount} <br />
                    total: ${dataPro[i].total} <br />
                  </span>
                </span>
              </td>
              <td>${dataPro[i].count}</td>
              <td>${dataPro[i].category}</td>
              <td><button onclick="updateItem(${i})" class="update">Update</button></td>
              <td><button onclick="deleteItem(${i})" class="delete">Delete</button></td>
            </tr>
    `;
  }

  let tbody = document.getElementById("tbody");
  tbody.innerHTML = table;

  // delete all
  let btnDelete = document.getElementById("deleteAll");
  if (dataPro.length > 0) {
    btnDelete.innerHTML = `<button onclick = "deleteAll()">Delete All (${totalItemNum})</button>`;
  } else {
    btnDelete.innerHTML = "";
  }
}
showData();

// delete
function deleteItem(i) {
  submit.innerHTML = "Create";
  submitMood = "create";
  if (dataPro[i].count > 1) {
    dataPro[i].count -= 1;
  } else {
    dataPro.splice(i, 1);
  }
  localStorage.product = JSON.stringify(dataPro);
  showData();
}

// deleteAll
function deleteAll() {
  submit.innerHTML = "Create";
  submitMood = "create";
  localStorage.clear();
  dataPro = [];
  showData();
}

// update
function updateItem(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  getTotalPrice();
  count.value = dataPro[i].count;
  category.value = dataPro[i].category;
  submitMood = "update";
  indexOfUpdate = i;
  submit.innerHTML = "Update";
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// search
function getSearchMood(id) {
  if (id === "byTitle") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  search.placeholder = "Search By " + searchMood;
  search.focus();
  search.value = "";
  showData();
}

function searchData(value) {
  let table = ``;
  let listOfIndex = [];
  for (let i = 0; i < dataPro.length; i++) {
    if (searchMood == "title") {
      if (dataPro[i].title.includes(value.toLowerCase())) {
        listOfIndex.push(i);
      }
    } else {
      if (dataPro[i].category.includes(value.toLowerCase())) {
        listOfIndex.push(i);
      }
    }

    for (let i = 0; i < listOfIndex.length; i++) {
      table += `
            <tr>
              <td>${i + 1}</td>
              <td>${dataPro[listOfIndex[i]].title}</td>
              <td>
                ${dataPro[listOfIndex[i]].price}
                <span class="tooltip">
                  ℹ
                  <span class="tooltiptext">
                    price: ${dataPro[listOfIndex[i]].total} <br />
                    taxes: ${dataPro[listOfIndex[i]].taxes} <br />
                    ads: ${dataPro[listOfIndex[i]].ads} <br />
                    discound: ${dataPro[listOfIndex[i]].discount} <br />
                    total: ${getTotalPrice()} <br />
                  </span>
                </span>
              </td>
              <td>${dataPro[listOfIndex[i]].count}</td>
              <td>${dataPro[listOfIndex[i]].category}</td>
              <td><button onclick="updateItem(${
                listOfIndex[i]
              })" class="update">Update</button></td>
              <td><button onclick="deleteItem(${
                listOfIndex[i]
              })" class="delete">Delete</button></td>
            </tr>
    `;
    }
  }
  tbody.innerHTML = table;
}

