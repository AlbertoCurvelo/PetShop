//Condicional para separar las acciones js - según la pagina
  //index
if(document.querySelector('#homePage')){
  //farmacia
  }else if(document.querySelector('#farmacia')){
    loadData("farmacia")
    getProduct(true)
  //Juguetes
  }else if(document.querySelector('#juguetes')){
    loadData("juguetes")
    getProduct(true)
   //Contactanos
  }else if(document.querySelector('#contacto')){
    loadContact()
    viewModalSubmit()
  //Vista Articulo 
  }else if(document.querySelector('#articleMore')){
    loadArticleMore(document.location.href)
    getProduct(false)
  }
  shopCar()
  //Carga de la API y derivasiones
  function loadData(farmaciaOrJuguetes){
    fetch(`../js/data.json`)
    .then(response => response.json())
    .then(data=>{
      sessionStorage.setItem("articlesShop", JSON.stringify(data.response));
      loadArticles(data,farmaciaOrJuguetes);
    })
  }
  function loadArticles(data, farmaciaOrJuguetes){
    var articles=[]
    var vistaCompleta=false
    for(var i=0;i<data.response.length;i++){
      if(data.response[i].tipo=="Medicamento"&&farmaciaOrJuguetes=="farmacia"){
          articles.push(data.response[i])
        }
        else{
          if(data.response[i].tipo=="Juguete"&&farmaciaOrJuguetes=="juguetes") {
          articles.push(data.response[i])
          }
          //Si accede a la vista completa del articulo
          else if(data.response[i]._id===farmaciaOrJuguetes){
            viewArticuloCompleto(data.response[i])
            vistaCompleta=true
          }
        }
      }
    if(vistaCompleta!=true)viewArticles(articles)
  }
  function viewArticles(articles){
    viewArticles=document.querySelector('.viewArticles')
    for(var i=0;i<articles.length;i++){
      newCard=document.createElement('div')
      newCard.className="card"
      newCard.id=articles[i]._id
      var cadena=`
          <div class="img activator waves-effect waves-block waves-light" style="background-image:url('${articles[i].imagen}');"></div>
          <div class="card-content">
            <div class="id hidden">
              <a>${articles[i]._id}</a>
            </div>
            <div class="tipo hidden">
              <a>${articles[i].tipo}</a>
            </div>
            <div class="span">
              <span id="nombreArticle" class="card-title activator">${articles[i].nombre}</span>
              <h5 id="precioArticle">$${articles[i].precio}</h5>
              <div class="finalCard">`
      if(articles[i].stock<6){
        cadena+=`
            <span class="ultimasUnidades">¡Ultimas unidades!</span>`
      }else{
        cadena+=`
            <span class="ultimasUnidades"></span>`
      }
      cadena+=`
                <div class="fcEnd">
                  <a href="viewArticles.html?id=${articles[i]._id}">Ver más</a>
                  <a id="addProduct" class="waves-effect waves-light btn modal-trigger btnArticle"><i class="material-icons">add_shopping_cart</i></a>
                </div>
              </div>
            </div>
          </div>
          <div class="card-reveal">
            <div class="span">
              <span class="card-title">${articles[i].nombre}<i class="material-icons right">close</i></span>
              <p>${articles[i].descripcion}</p>
            </div>
          </div>
      `
      newCard.innerHTML=cadena
      viewArticles.appendChild(newCard)
    }
    getProduct(true)
  }
  function loadArticleMore(direccion){
    id=direccion.split("=",2)
    //id[1] es el id del articulo
    loadData(id[1])
  }
  function viewArticuloCompleto(article){
    if(article.tipo=="Medicamento"){
      document.querySelector('#farma').className="active"
    }else{
      document.querySelector('#jugue').className="active"
    }
    viewArticle=document.querySelector('.viewArticle')
      newCard=document.createElement('div')
      newCard.className="superCard"
      var cadena=`
          <div class="img" style="background-image:url('${article.imagen}');"></div>
            <div class="span">
              <span id="articleId" class="hidden">${article._id}</span>
              <span id="articleTipo" class="hidden">${article.tipo}</span>
              <span id="articleNombre" class="card-title activator">${article.nombre}</span>
              <p>${article.descripcion}</p>
              <div class="precio finalCard">
              <div id="buy" class="sfCard">
                <h5 id="articlePrecio">$${article.precio}</h5>
                <a id="addProduct" class="waves-effect waves-light btn"><i class="material-icons">add_shopping_cart</i></a>
              </div> 
              `
      if(article.stock<6){
        cadena+=`
          <span class="ultimasUnidades">¡Ultimas unidades!</span>
        `
      }else{
        cadena+=`
            <span class="ultimasUnidades"></span>`
      }       
      cadena+=`       
      </div></div>`
      newCard.innerHTML=cadena
      viewArticle.appendChild(newCard)
  }
  function loadContact(){
    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelector('#select');
      var options
      var instances = M.FormSelect.init(elems, options);
  });
  }
  //iniciando el modal
  function loadModal(){
    document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelector('#modalConfirm');
    var options
    var instances = M.Modal.init(elems, options);
    });
  }
  //submit de modal
  function viewModalSubmit(){
    $('#submit').on('click', function(e) {
      if(document.getElementById('first_name').value!=""&&document.getElementById('last_name').value!=""&&document.getElementById('phone').value!=""){
        e.preventDefault();
        var elems = document.querySelector('#modalConfirm');
        var options
        var instances = M.Modal.init(elems, options);
      }
    });
  }

  //Shop Car
  function shopCar(){
    //En la espera del click, para abrir el carro de compras
    document.getElementById('car').addEventListener('click', function(e) {
      e.preventDefault();
      viewModalCar()
      actualizarCar()
    });
    if(document.getElementById('vaciarCarro')){
      document.getElementById('vaciarCarro').addEventListener('click', function(e){
        e.preventDefault();
        cleanCar()
        actualizarCar()
      })
    }
    //actualiza carro cuando entra en la pagina
    actualizarCar()
  }
  function editCantArticle(idArticle,operation){
    var articleFilteredShop=JSON.parse(sessionStorage.getItem("articlesShop")).filter(article=>article._id===idArticle)[0]
    carShop=carShop.filter(article=>{
        if(article._id===idArticle){
          switch (operation) {
            case 'add':{
              if(articleFilteredShop.stock>=(article.stock+1)){
                article.stock+=1
              }else{
                M.toast({html:"No se puede agregar cantidad del "+article.nombre+", ya que supera el stock de la tienda que es de: "+articleFilteredShop.stock, classes: 'rounded toast red'});
              }
            break;}
            case 'deduct':{
              if((article.stock-1)>0){
                article.stock-=1
              }else{
                M.toast({html:"Debes seleccionar una cantidad mayor a 1, y que no supere el stock de la tienda que es de: "+articleFilteredShop.stock, classes: 'rounded toast red'});
              }
            break;}
          }
          document.getElementById(`cant${article._id}`).innerHTML=article.stock
          document.getElementById(`price${article._id}`).innerHTML='$'+article.stock*article.precio
          return article
        }else{
          return article
        }
    })
    var total=0
    carShop.map(article=>(total+=article.precio*article.stock))
    document.getElementById(`totalCar`).innerHTML=total
    sessionStorage.setItem("usuario", JSON.stringify(carShop));
  }
  function addCar(idProduct){
    articlesShop=JSON.parse(sessionStorage.getItem("articlesShop"))
    articleFilteredShop=articlesShop.filter(article=>article._id===idProduct)[0]
    carShop=JSON.parse(sessionStorage.getItem("usuario"))
    articleFilteredCarShop=carShop.filter(article=>article._id===idProduct)[0]
    if(articleFilteredCarShop){
      if(articleFilteredShop.stock>=(articleFilteredCarShop.stock+1)){
        carShop=carShop.filter(article=>{
          if(article._id===idProduct){
            article.stock+=1
            return article
          }else{
            return article
          }
        })
        sessionStorage.setItem("usuario", JSON.stringify(carShop));
        M.toast({html: articleFilteredShop.nombre+", se agrego al carrito", classes: 'rounded toast green'});
        actualizarCar()
      }else{
        M.toast({html:"No se puede agregar el articulo "+articleFilteredCarShop.nombre+", ya que supera el stock de la tienda que es de: "+articleFilteredShop.stock, classes: 'rounded toast red'});
      }
    }else{
      articleFilteredShop.stock=1
      carShop.push(articleFilteredShop)
      M.toast({html: articleFilteredShop.nombre+", se agrego al carrito", classes: 'rounded toast green'});
      sessionStorage.setItem("usuario", JSON.stringify(carShop));
      actualizarCar()
    }
  }
  function posicionObjeto(carShop,product){
    for(var i=0;i<carShop.id.length;i++){
      if(carShop.id[i]==product.id){
        return i
      }
    }
  }
  function cleanCar(){
    sessionStorage.clear();
    M.toast({html: "Se ha vaciado el carrito!.", classes: 'rounded toast green'});
  }
  //Actualizar Carro o crea el objeto en la session
  function actualizarCar(){
    var carShop=[]
    //Si no tiene nada cargado
    if(sessionStorage.getItem("usuario")==null){
      document.getElementById('shopCar').innerText=0
      sessionStorage.setItem("usuario", JSON.stringify(carShop));
    //Si hay items en el carro
    }else{
      carShop=JSON.parse(sessionStorage.getItem("usuario"))
      document.getElementById('shopCar').innerText=carShop.length
    }
  }

  function getProduct(where){
    botones=document.getElementsByClassName('btnArticle')
    for(var i=0;i<botones.length;i++){
      botones[i].addEventListener('click',e=>{
        if((e.target.parentElement.id=="addProduct")||e.target.id=="addProduct"){
          if(e.target.parentElement&&e.target.parentElement.id=="addProduct"){
            var elementSelected=e.target.parentElement
          }else{
            var elementSelected=e.target
          }
          if(where){
            addCar(elementSelected.parentElement.parentElement.parentElement.parentElement.querySelector('.hidden').querySelector('a').text)
          }else{
            addCar(e.toElement.parentElement.parentElement.parentElement.parentElement.querySelector('#articleId').innerHTML)
          }
        }
      })
    }
  }
  function finishBuy(){
    if(carShop.length>0){
      sessionStorage.clear();
      location.href='../pages/gracias.html'
    }else{
      M.toast({html: "Debes tener al menos un articulo para poder finalizar la compra!.", classes: 'rounded toast yellow'});
    }
  }
  function viewModalCar(){
    divTableJuguetes=document.querySelector('.tableJuguetes')
    divTableMedicinas=document.querySelector('.tableMedicinas')
    carShop=JSON.parse(sessionStorage.getItem("usuario"))
    divTableMedicinas.innerHTML=viewTable(carShop,"Medicinas")
    divTableJuguetes.innerHTML=viewTable(carShop,"Juguetes")
    //añadiendo listener a los botones
    carShop.map(article=>{
      if( document.getElementById(`deduct${article._id}`)){
        document.getElementById(`deduct${article._id}`).addEventListener('click', function(e){
          e.preventDefault();
          editCantArticle(e.target.id.split('deduct')[1],'deduct')
        })
      }
      if( document.getElementById(`add${article._id}`)){
        document.getElementById(`add${article._id}`).addEventListener('click', function(e){
          e.preventDefault();
          editCantArticle(e.target.id.split('add')[1],'add')
        })
      }
    })
    var elems = document.querySelector('#modalProducto');
    var options
    var instances = M.Modal.init(elems, options);
  }
  function viewTable(carShopM,medicinasJuguetes){
    var total=0
    var med,jug=false
    var cadena=`
      <table class="table text-center">
        <thead class="m-5">
          <tr>
              <th>Articulo</th>
              <th>Cantidad</th>
              <th>Precio</th>
          </tr>
        </thead>
        <tbody id="tablePartys">`
    for(var i=0;i<carShopM.length;i++){
      total+=(parseFloat(carShopM[i].precio).toFixed(2)*carShopM[i].stock)
      if(medicinasJuguetes=="Medicinas"&&carShopM[i].tipo=="Medicamento"){
        cadena+=`
        <tr>
          <td><div class="viewMinArticle"><div class="viewMinArticleImg"><div class="viewMinArticleImgView" style=background-image:url(${carShopM[i].imagen}></div></div><span class="viewMinArticleName">${carShopM[i].nombre}</span></div></td>
          <td><div class="viewMinCant"><p class="editCant deductCant" id="deduct${carShopM[i]._id}">-</p><span id="cant${carShopM[i]._id}" class="viewMinCantText">${carShopM[i].stock}</span><p class="editCant addCant" id="add${carShopM[i]._id}">+</p></div></td>
          <td id="price${carShopM[i]._id}" class="precio">$${parseFloat(carShopM[i].precio).toFixed(2)*carShopM[i].stock}</td>
        </tr>
        `
        med=true
      }else if(medicinasJuguetes=="Juguetes"&&carShopM[i].tipo=="Juguete"){
        cadena+=`
        <tr>
          <td><div class="viewMinArticle"><div class="viewMinArticleImg"><div class="viewMinArticleImgView" style=background-image:url('${carShopM[i].imagen}')></div></div><span class="viewMinArticleName">${carShopM[i].nombre}</span></div></td>
          <td><div class="viewMinCant"><p class="editCant deductCant" id="deduct${carShopM[i]._id}">-</p><span id="cant${carShopM[i]._id}" class="viewMinCantText">${carShopM[i].stock}</span><p class="editCant addCant" id="add${carShopM[i]._id}">+</p></div></td>
          <td id="price${carShopM[i]._id}" class="precio">$${parseFloat(carShopM[i].precio).toFixed(2)*carShopM[i].stock}</td>
        </tr>
        `
        jug=true
      }
    }
    if(!med&&!jug)cadena+=`<tr><td colspan="3">No hay productos agregados.</td></tr>`
    cadena+=`</tbody></table>`
    document.querySelector('.totalCarro').innerHTML=`<h4>Total: $<span id="totalCar">${total}</span></h4>`
    return cadena
  }