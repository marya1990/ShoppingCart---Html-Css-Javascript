import { productsData } from "./product.js";
const cartBtn=document.querySelector(".cart-btn");
const cartModal=document.querySelector(".cart");
const backDrop=document.querySelector(".backdrop");
const closeModal=document.querySelector(".cart-item-confirm");
const productsDOM=document.querySelector(".products-center");
const cartTotal=document.querySelector(".cart-total");
const cartItems=document.querySelector(".cart-items");
const cartContent=document.querySelector(".cart-content");
const clearCart=document.querySelector(".clear-cart");

let cart=[];

let buttonsDom=[];



//get products

class Products{
    getproducts(){
        return productsData;
        
    }
}

// display products 
class UI{
    displayProducts(products){
        
        products.forEach(item => {
            let{ id,title,price,imageUrl}=item;
            productsDOM.innerHTML += `
            <div class="product">
                <div class="img-container">
                    <img src=${imageUrl} class="product-img">
                
                </div>
                <div class="product-desc">
                    <p class="product0price">${price} $</p>
        
                    <p class="product-title">${title}</p>
                </div>
                <button class="btn add-to-cart" data-id=${id}> <i class="fas fa-shopping-cart"></i>
        add to cart
      </button>
            
        </div>
            `
            //productsDOM.innerHTML=result; 
         
        });
       

    }
   getAddToCartBtns(){
    const addToCartBtns=[...document.querySelectorAll(".add-to-cart")];
    buttonsDom=addToCartBtns;
    
   
   
   addToCartBtns.forEach(btn=>{
        let id=btn.dataset.id;
        
        //check if this product id is in cart or not?
        const isInCart=cart.find(p=>p.id===parseInt(id));
        if(isInCart){
            btn.innerText="In Cart";
            btn.invisibled=true;
        }
        btn.addEventListener("click",e=>{
            e.target.innerText="In Cart";
            e.target.invisibled=true;
           
             //get product from products
       let addedProduct={...Storage.getProduct(id),quantity:1};
       
       // add to cart
       cart=[...cart,addedProduct]
      
       //save cart to lpcalstorage
       Storage.saveCart(cart);
       //update cartValue
       this.setCartValue(cart);
       //add to cart  item
       this.addCartItem(addedProduct);

        })
       
    })
   
   }
   setCartValue(cart){
    let tempCartItems=0;
    const totalPrice=cart.reduce((acc,curr)=>{
        tempCartItems+= curr.quantity;
        
        return acc + curr.quantity * curr.price;

    },0);
    cartTotal.innerText=`total price : ${parseFloat(totalPrice).toFixed(2)}$`;
    cartItems.innerText=tempCartItems;
   }
   addCartItem(cart){
    const div=document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML=`
     
    <div>            
    <img src=${cart.imageUrl}  class="cart-item-img"></div>
    <div class="cart-item-desc">
        <h4>${cart.title}</h4>
        <h5>$ ${cart.price}</h5>
    </div>
    <div class="cart-item-controller">
        <i class="fas fa-chevron-up" data-id=${cart.id}></i>
        <p>${cart.quantity}</p>
        <i class="fas fa-chevron-down " data-id=${cart.id}></i>
    </div>
    <i class="far fa-trash-alt" data-id=${cart.id}></i>
`;
     cartContent.appendChild(div);
   }
   setupApp(){
    //get cart from storage
    cart=Storage.getCart()||[] ;
    //addCartItem
    cart.forEach((cartItem)=>this.addCartItem(cartItem));
    this.setCartValue(cart);
    //setvalue: price+items
  }
  cartLogic(){
    //clear cart:
    
    clearCart.addEventListener("click",()=>{
        this.clearCart();
      
    })
    cartContent.addEventListener("click",e=>{
        if (e.target.classList.contains("fa-chevron-up")){
            console.log(e.target.dataset.id);
            const addQuantity=e.target;
            const addedItem=cart.find(cItem=>cItem.id==addQuantity.dataset.id)
            addedItem.quantity++;
            this.setCartValue(cart);
            Storage.saveCart(cart);
            addQuantity.nextElementSibling.innerText = addedItem.quantity;
        }else if(e.target.classList.contains("fa-trash-alt")){
            const removeItem=e.target;
            const _removedItem=cart.find(cItem=>cItem.id==removeItem.dataset.id);
            this.removeItem(_removedItem.id);
            Storage.saveCart(cart);
            cartContent.removeChild(removeItem.parentElement);

        }
        else if(e.target.classList.contains("fa-chevron-down")){
            const subQuantity=e.target;
            const substractedItem=cart.find(cItem=>cItem.id==subQuantity.dataset.id);
            if(substractedItem.quantity===1){
               this.removeItem(substractedItem.id);
               Storage.saveCart(cart);
               cartContent.removeChild(subQuantity.parentElement.parentElement) ;
               return
            }
            substractedItem.quantity--;
            this.setCartValue(cart);
            Storage.saveCart(cart);
            subQuantity.previousElementSibling.innerText=substractedItem.quantity;
        }
    })
  }
  clearCart(){
    cart.forEach(cItem => this.removeItem(cItem.id));
    //remove cart content children
    while(cartContent.children.length){
    cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id){
    cart=cart.filter(cItem => cItem.id !== id);
    this.setCartValue(cart);
    Storage.saveCart(cart);
    this.getSingleButton(id);
    
    }
    getSingleButton(id){
        const button=buttonsDom.find(btn=> parseInt(btn.dataset.id ) == parseInt(id));
        button.innerText= "add to cart";
        button.invisibled=false;
    }

  }


class Storage{
    static saveproducts(products){
        localStorage.setItem("products",JSON.stringify(products));
    }
    static getProduct(id){
        const _products=JSON.parse(localStorage.getItem("products"));
        if (_products){
            return _products.find((p) => p.id===parseInt(id));
        }

    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart))

    }
    static getCart(cart){
        return JSON.parse(localStorage.getItem("cart"));
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    const products=new Products()
    const productsData=products.getproducts()
    const ui=new UI();
    ui.cartLogic();
  
    ui.setupApp();
    ui.displayProducts(productsData);
    ui.getAddToCartBtns();
    Storage.saveproducts(productsData);
})

function showModalFunction() {
    backDrop.style.display = "block";
    cartModal.style.opacity = "1";
    cartModal.style.top = "20%";
  }
  
  function closeModalFunction() {
    backDrop.style.display = "none";
    cartModal.style.opacity = "0";
    cartModal.style.top = "-100%";
  }
  cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
