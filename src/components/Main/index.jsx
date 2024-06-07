import { Component } from "react";
import Cookies from 'js-cookie'
import { jwtDecode } from "jwt-decode"
import { superCategories, subCategories, categories } from "./Categories";
import Previews from "../Previews";
import './styles.css'

class Main extends Component{
    state = {
        productName:"",
        productBrand:"",
        selectedSuperCategory:"",
        selectedCategory:"",
        selectedSubCategory:"",
        superCategroy:"",
        category:"",
        subCategory:"",
        noOfUnites:"",
        siUnit:"Kg",
        unitWeight:"",
        netWeight:0,
        grossWeight:"",
        description:"",
        calories:"",
        fat:"",
        saturatedFat:"",
        protien:"",
        carbs:"",
        fiber:"",
        sugar:"",
        salt:"",
        ingredients:"",
        dietary:"",
        storage:"",
        origin:"",
        prefix:0,
        suffix:1,
        countriesNames:[],
        image:[],
        fileNames:[],
        errors:[],
        imageInputKey: 0 ,
        products:[],
        imageError:"",
        username:"",
        validationErrors:{}
    }

    componentDidMount(){
       this.getContriesNames()
       this.getSuffix()
       this.getUsername()
    }

    getUsername = () =>{
        const token = Cookies.get('jwt_token')
        if(token){
            try{
                const decodedToken = jwtDecode(token)
                this.setState({username:decodedToken.username})
            }catch(e){
                console.log(e)
            }
        }
    }

    getSuffix = async() =>{
        try{
            const apiUrl = 'http://localhost:3000/count'
            const dbResponse = await fetch(apiUrl);
            const data = await dbResponse.json();
            if (data && data.productsSuffix !== undefined) {
                const dbSuffix = data.productsSuffix;
                this.setState({suffix:dbSuffix + 1})
            }else{
                const productCount = 1
                this.setState({suffix:productCount})
            }
        }catch(e){
            console.error(e)
        }
    }

    getContriesNames = async() =>{
        const apiUrl = 'https://api.first.org/data/v1/countries'
        const response = await fetch(apiUrl);
        const apidata = await response.json()
        const countriesData = Object.values(apidata.data).map(each => each.country)
       this.setState({countriesNames:countriesData})
    }

    onChangeProductName = (e) =>{
        this.setState({productName:e.target.value})
    }

    onChangeProductBrand = (e) =>{
        this.setState({productBrand:e.target.value})
    }

    changeSuperCategoryName = () =>{
        const {selectedSuperCategory} = this.state;
        if(selectedSuperCategory != ""){
            const name = superCategories.filter(each => each.id === selectedSuperCategory)
            this.setState({superCategroy:name[0].superCategoryName});
        }else{
            this.setState({superCategroy:"", prefix:0})
        }

    }

    onChangeSuperCategory = (e) =>{
        this.setState({selectedSuperCategory:e.target.value, selectedCategory:"",selectedSubCategory:"", category:"", subCategory:""}, this.changeSuperCategoryName)
    }

    changeCategoryName = () =>{
        const {selectedSuperCategory,selectedCategory} = this.state;
        const name = categories.filter(each => each.id === selectedCategory && each.sup_id === selectedSuperCategory);
        this.setState({category:name[0].categoryName});
    }

    onChangeCategory = (e) =>{
        this.setState({selectedCategory:e.target.value, selectedSubCategory:"", subCategory:""},() =>{ this.changeCategoryName(), this.changePrefix()})
    }

    changeSubCategoryName = () =>{
        const {selectedSuperCategory, selectedCategory, selectedSubCategory} = this.state;
        const name = subCategories.filter(each => each.id === selectedSubCategory && each.cat_id === selectedCategory && each.sup_id === selectedSuperCategory);
        this.setState({subCategory:name[0].subCategoryName})
    }

    onChangeSubCategory = (e) =>{
        this.setState({selectedSubCategory:e.target.value}, this.changeSubCategoryName)
    }

    onChangeNoOfUnits = (e) =>{
        const{noOfUnites, unitWeight} = this.state

        
        if(parseInt(noOfUnites) > 0 && parseInt(unitWeight) > 0){
            const neWeight = parseInt(noOfUnites) * parseInt(unitWeight);
            this.setState({noOfUnites:neWeight}, this.changeNetWeight)
        }
        this.setState({noOfUnites:e.target.value},this.changeNetWeight);
    }

    onChangeSiUnit = (e) =>{
        this.setState({siUnit:e.target.value});
    }

    changeNetWeight = () =>{
        const{noOfUnites, unitWeight} = this.state
        if(parseInt(noOfUnites) > 0 && parseInt(unitWeight) > 0){
            const nWeight = parseInt(noOfUnites) * parseInt(unitWeight);
            this.setState({netWeight:nWeight});
        }else{
            this.setState({netWeight:0})
        }
        
    }

    onChangeUnitWeight = (e) =>{
        this.setState({unitWeight:e.target.value}, this.changeNetWeight);
    }

    onChangeGrossWeight = (e) =>{
        this.setState({grossWeight:e.target.value});
    }

    onChangeDescription = (e) =>{
        this.setState({description:e.target.value})
    }

    onChangeCalories = (e) =>{
        this.setState({calories:e.target.value})
    }

    onChangeFat = (e) =>{
        this.setState({fat:e.target.value})
    }

    onChangeSaturatedFat = (e) =>{
        this.setState({saturatedFat:e.target.value})
    }

    onChangeProtien = (e) =>{
        this.setState({protien:e.target.value});
    }

    onChangeCarbs = (e) =>{
        this.setState({carbs:e.target.value});
    }

    onChangeFiber = (e) =>{
        this.setState({fiber:e.target.value})
    }

    onChangeSugar = (e) =>{
        this.setState({sugar:e.target.value})
    }

    onChangeSalt = (e) =>{
        this.setState({salt:e.target.value})
    }

    onChangeIngredients = (e) =>{
        this.setState({ingredients:e.target.value})
    }

    onChangeDietary = (e) =>{
        this.setState({dietary:e.target.value})
    }

    onChangeStorage = (e) =>{
        this.setState({storage:e.target.value})
    }

    onChangeOrigin = (e) =>{
        this.setState({origin:e.target.value})
    }

    changePrefix = () =>{
        const{selectedSuperCategory, selectedCategory} = this.state
        if (selectedSuperCategory != "" && selectedCategory != ""){
            this.setState({prefix:selectedSuperCategory + selectedCategory})
        }else{
            this.setState({prefix:0})
        }
       
    }

    onChangeImage = (event) => {
        const file = event.target.files[0]
        if(file){
            if(file.size > 250 * 1024){
                this.setState({imageError:`${file.name} is larger than 250KB`})
            }else{
                const reader = new FileReader();
                reader.onload = (e) =>{
                    this.setState(prev => ({ image:[...prev.image, e.target.result],fileNames:[...prev.fileNames, file.name], imageError: ' '}));
                };
                reader.readAsDataURL(file);
            }
        } 
    };


    validate = () => {
        const errors = {};
        const { noOfUnites, unitWeight, netWeight, grossWeight, calories, fat, saturatedFat, protien, carbs, sugar, fiber, salt } = this.state;
    
        if (!noOfUnites) {
          errors.noOfUnits = 'Number of Units is required';
        } else if (isNaN(noOfUnites)) {
          errors.noOfUnits = 'Number of Units must be a number';
        }
    
        if (!unitWeight) {
          errors.unitWeight = 'Unit Weight is required';
        } else if (isNaN(unitWeight)) {
          errors.unitWeight = 'Unit Weight must be a number';
        }
    
        if (!netWeight) {
          errors.netWeight = 'Net Weight is required';
        } else if (isNaN(netWeight)) {
          errors.netWeight = 'Net Weight must be a number';
        }
    
        if (!grossWeight) {
          errors.grossWeight = 'Gross Weight is required';
        } else if (isNaN(grossWeight)) {
          errors.grossWeight = 'Gross Weight must be a number';
        } else if (parseFloat(grossWeight) < parseFloat(netWeight)) {
          errors.grossWeight = 'Gross Weight must be greater than or equal to Net Weight';
        }


    if (!calories) {
        errors.calories = 'Calories is required';
      } else if (!/^\d+\/\d+$/.test(calories)) {
        errors.calories = 'Calories must be in the format "number/number"';
      }
  
      if (!fat) {
        errors.fat = 'Fat is required';
      } else if (isNaN(fat)) {
        errors.fat = 'Fat must be a number';
      }
  
      if (!saturatedFat) {
        errors.saturatedFat = 'Saturated Fat is required';
      } else if (isNaN(saturatedFat)) {
        errors.saturatedFat = 'Saturated Fat must be a number';
      }
  
      if (!carbs) {
        errors.carbs = 'Carbs is required';
      } else if (isNaN(carbs)) {
        errors.carbs = 'Carbs must be a number';
      }
  
      if (!fiber) {
        errors.fiber = 'Fiber is required';
      } else if (isNaN(fiber)) {
        errors.fiber = 'Fiber must be a number';
      }
  
      if (!sugar) {
        errors.sugar = 'Sugar is required';
      } else if (isNaN(sugar)) {
        errors.sugar = 'Sugar must be a number';
      }
  
      if (!protien) {
        errors.protien = 'Protien is required';
      } else if (isNaN(protien)) {
        errors.protien = 'Protien must be a number';
      }
  
      if (!salt) {
        errors.salt = 'Salt is required';
      } else if (isNaN(salt)) {
        errors.salt = 'Salt must be a number';
      }
    
        this.setState({ validationErrors:errors });
        return Object.keys(errors).length === 0;
      }
    
    
    onClickSave = async () =>{
        const {
            productName,
            productBrand,
            superCategroy,
            category,
            subCategory,
            noOfUnites,
            siUnit,
            unitWeight,
            netWeight,
            grossWeight,
            description,
            protien,
            carbs,
            fiber,
            calories,
            fat,
            saturatedFat,
            sugar,
            salt,
            ingredients,
            dietary,
            storage,
            origin,
            suffix,
            image,
            fileNames,
            products,
            username

        } = this.state
        const formData = {
            product_name:productName,
            product_brand:productBrand,
            super_category:superCategroy,
            category:category,
            sub_category:subCategory,
            no_of_units:noOfUnites,
            si_units:siUnit,
            unit_weight:unitWeight,
            net_weight:netWeight,
            gross_weight:grossWeight,
            description:description,
            calories:calories,
            fat:fat,
            saturated_fat:saturatedFat,
            carbs:carbs,
            fiber:fiber,
            sugar:sugar,
            protien:protien,
            salt:salt,
            ingredients:ingredients,
            dietary:dietary,
            storage:storage,
            origin:origin,
            product_id:suffix,
            images:image,
            fileNames:fileNames,
            username:username
        }

        
        if (productName != "" && productBrand !="" && superCategroy !="" && category != "" && subCategory != "" &&
            noOfUnites != "" && siUnit !="" && unitWeight !=""  && grossWeight !="" && description !="" &&
            protien !="" && carbs !="" && fiber !="" && ingredients !="" && dietary !="" && storage !="" && origin!="" &&
            calories != "" && fat != "" && saturatedFat !="" && sugar != "" && salt != "" && image!= null) {
               if(this.validate()){
                this.setState(prev => ({
                    products: [...products, formData],
                    productName: '',
                    productBrand: '',
                    superCategroy:"",
                    selectedSuperCategory:"",
                    selectedCategory:"",
                    selectedSubCategory:"",
                    category: '',
                    subCategory: '',
                    noOfUnites: '',
                    siUnit: 'Kg',
                    unitWeight: '',
                    netWeight: '',
                    grossWeight: '',
                    description: '',
                    calories:'',
                    fat:'',
                    saturatedFat:'',
                    carbs: '',
                    fiber: '',
                    sugar:'',
                    protien: '',
                    salt:'',
                    ingredients: '',
                    dietary: '',
                    storage: '',
                    origin: '',
                    suffix:prev.suffix + 1,
                    prefix:0,
                    imageInputKey: prev.imageInputKey + 1,
                    image:[],
                    fileNames:[],
                  }));
               }
              alert("Product Saved")
            }else{
                alert("All fields must be filled")
            }
    }

    onClickSubmit = async(event) =>{
        event.preventDefault()
        const {products} = this.state
        products.map(each => console.log(each))
        await products.map(async(each) => {
            const options = {
                method:'POST',
                headers:{
                        'Content-Type': 'application/json'
                },
                body:JSON.stringify(each)
            }
    
                
                const postUrl = 'http://localhost:3000/products'
                const dbResponse = await fetch(postUrl,options);
            
                console.log(dbResponse)
            })
        this.setState({products:[]});
    }

    editPreview = (index, item) => {
        const itemToEdit = item[0]
        
        this.setState(prev =>({
            productName:itemToEdit.product_name,
            productBrand:itemToEdit.product_brand,
            superCategroy:itemToEdit.super_category,
            category:itemToEdit.category,
            subCategory:itemToEdit.sub_category,
            noOfUnites:itemToEdit.no_of_units,
            siUnit:itemToEdit.si_units,
            unitWeight:itemToEdit.unit_weight,
            netWeight:itemToEdit.net_weight,
            grossWeight:itemToEdit.gross_weight,
            description:itemToEdit.description,
            calories:itemToEdit.calories,
            fat:itemToEdit.fat,
            saturatedFat:itemToEdit.saturated_fat,
            carbs:itemToEdit.carbs,
            fiber:itemToEdit.fiber,
            sugar:itemToEdit.sugar,
            protien:itemToEdit.protien,
            salt:itemToEdit.salt,
            ingredients:itemToEdit.ingredients,
            dietary:itemToEdit.dietary,
            storage:itemToEdit.storage,
            origin:itemToEdit.origin,
            suffix:itemToEdit.product_id,
            image:itemToEdit.images,
            fileNames:itemToEdit.fileNames,
            products:prev.products.filter(each => each.product_id !== index)
        }))
      };
    


    render(){
        const{
            productName,
            productBrand,
            noOfUnites,
            siUnit,
            unitWeight,
            grossWeight,
            netWeight,
            description,
            calories,
            fat,
            saturatedFat,
            protien,
            carbs,
            fiber,
            sugar,
            salt,
            ingredients,
            dietary,
            storage,
            origin,
            prefix,
            suffix,
            selectedSuperCategory,
            selectedCategory,
            selectedSubCategory,
            countriesNames,
            products,
            fileNames,
            imageError,
            image,
            username,
            validationErrors
        } = this.state

        console.log(validationErrors)
        const productsCount = products.length

        const filtereredCategories = categories.filter(cat => cat.sup_id === selectedSuperCategory);


        const filtereredSubCategories = subCategories.filter(sub => sub.cat_id === selectedCategory && sub.sup_id === selectedSuperCategory);
        const sortedProducts = products.sort((a,b) =>{
            a.product_id - b.product_id
        }) 
        return(
            <div className="main-container">
                <form className="main-form"  encType="multipart/form-data" onSubmit={this.onClickSubmit}>
                    <div className="product-name-container input-container">
                        <label htmlFor="product-name" className="form-label">
                            PRODUCT NAME
                        </label>
                        <input 
                            id = "product-name" 
                            type="text" 
                            value={productName}
                            className="form-input" 
                            placeholder="Product Name" 
                            onChange={this.onChangeProductName}
                        />
                    </div>
                    <div className="product-brand-container input-container">
                        <label htmlFor="product-brand" className="form-label">
                            PRODUCT BRAND
                        </label>
                        <input 
                            id = "product-brand" 
                            type="text" 
                            value={productBrand}
                            className="form-input" 
                            placeholder="Product Brand" 
                            onChange={this.onChangeProductBrand}/>
                    </div>
                    <div className="catigoriees-container input-container">
                        <h1 className="categories-heading">
                            Categories
                        </h1>
                        <div className="categories-container">
                            <div className="single-category">
                                <label htmlFor="super-category" className="form-label form-label-onethird">SUPER CATEGORY</label>
                                <select id = "super-category" value = {selectedSuperCategory} className="form-input form-input-half" onChange={this.onChangeSuperCategory}>
                                    <option value="">Select Super Category</option>
                                    {superCategories.map(each => <option key={each.id} value = {each.id}>{each.superCategoryName}</option>)}
                                </select>
                            </div>
                            <div className="single-category">
                                <label htmlFor="category" className="form-label form-label-onethird">CATEGORY</label>
                                <select id = "category" value={selectedCategory} className="form-input form-input-half" onChange={this.onChangeCategory} disabled={!selectedSuperCategory}>
                                    <option value="">Select Category</option>
                                    {
                                        filtereredCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.categoryName}</option>)
                                    }
                                </select>
                            </div>
                            <div className="single-category">
                                <label htmlFor="sub-category" className="form-label form-label-onethird">SUB CATEGORY</label>
                                <select id = "sub-category"  value={selectedSubCategory} className="form-input form-input-half" onChange={this.onChangeSubCategory} disabled={!selectedCategory}>
                                    <option value="">Select Sub Category</option>
                                    {
                                        filtereredSubCategories.map(sub => <option key={sub.id} value={sub.id}>{sub.subCategoryName}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="units-si-units-container">
                        <div className="input-container-half">
                            <label htmlFor="no-of-units" className="form-label form-label-half">
                                NO OF UNITS
                            </label>
                            <input 
                                id= "no-of-units" 
                                type="text" 
                                value={noOfUnites}
                                className="form-input form-input-half" 
                                placeholder="No.of.units" 
                                onChange={this.onChangeNoOfUnits}/>
                            {validationErrors.noOfUnits && <p className="Max-images-warning error-text">{validationErrors.noOfUnits}</p>}
                        </div>
                        <div className="input-container-half">
                            <label htmlFor="si-units" className="form-label form-label-half">
                                SI UNITS
                            </label>
                            <select 
                                id = "si-units" 
                                value={siUnit} 
                                className="form-input form-input-half" 
                                onChange={this.onChangeSiUnit}
                            >
                                <option value="kg">
                                    Kg
                                </option>
                                <option value="L">
                                    L
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className="weights-container">
                        <div className="single-weight-container">
                            <label htmlFor="unit-weight" className="form-label form-label-onethird">UNIT WEIGHT</label>
                            <input 
                                id="unit-weight"
                                type="text"
                                value={unitWeight} 
                                className="form-input form-input-half" 
                                placeholder="Unit Weight" 
                                onChange = {this.onChangeUnitWeight}
                            />
                            {validationErrors.unitWeight && <p className="Max-images-warning error-text">{validationErrors.unitWeight}</p>}
                        </div>
                        <div className="single-weight-container">
                            <h1 className="form-label form-label-onethird">NET WEIGHT</h1>
                            <div  className="form-input form-input-half net-weight">
                                <p>{netWeight}</p>
                            </div>
                            {validationErrors.netWeight && <p className="Max-images-warning error-text">{validationErrors.netWeight}</p>}
                        </div>
                        <div className="single-weight-container">
                            <label htmlFor="gross-weight" className="form-label form-label-onethird">GROSS WEIGHT</label>
                            <input 
                                id="gross-weight" 
                                type="text"
                                value={grossWeight}
                                className="form-input form-input-half" 
                                placeholder="Unit Weight"
                                onChange={this.onChangeGrossWeight}
                            />
                            {validationErrors.grossWeight && <p className="Max-images-warning error-text">{validationErrors.grossWeight}</p>}
                        </div>
                    </div>
                    <div className="product-information-container">
                        <h1 className="product-information-heading">PRODUCT INFORMATION</h1>
                        <div className="description-container">
                            <label htmlFor="product-description" className="form-label">DESCRIPTION</label>
                            <textarea 
                                id="product-description" 
                                placeholder="Enter Product Description" 
                                onChange={this.onChangeDescription} 
                                value={description} 
                                className="description"
                                rows="4"
                                cols="50"
                            >
                                {description}
                            </textarea>
                        </div>
                        
                        <div className="description-container">
                            <h1 className="form-label">NURITION VALUE</h1>
                            <div className="categories-container">
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="calories" className="form-label form-label-onethird">CALORIES</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "calories" 
                                                className="nutrition-inputs" 
                                                placeholder="Calories"
                                                value={calories}
                                                onChange={this.onChangeCalories}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>KJ/Kcal</p>
                                            </div>
                                        </div>
                                        {validationErrors.calories && <p className="Max-images-warning error-text">{validationErrors.calories}</p>}
                                       
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="fat" className="form-label form-label-onethird">FAT</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "fat" 
                                                className="nutrition-inputs" 
                                                placeholder="Fat"
                                                value={fat}
                                                onChange={this.onChangeFat}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.fat && <p className="Max-images-warning error-text">{validationErrors.fat}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="saturatedfat" className="form-label form-label-onethird">SATURATED FAT</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "saturatedfat" 
                                                className="nutrition-inputs"
                                                placeholder="Saturated Fat"
                                                value={saturatedFat}
                                                onChange={this.onChangeSaturatedFat}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.saturatedFat && <p className="Max-images-warning error-text">{validationErrors.saturatedFat}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="carbs" className="form-label form-label-onethird">CARBS</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "carbs"
                                                value={carbs}
                                                className="nutrition-inputs"
                                                placeholder="Carbs"
                                                onChange={this.onChangeCarbs}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.carbs && <p className="Max-images-warning error-text">{validationErrors.carbs}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="fiber" className="form-label form-label-onethird">FIBER</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "fiber" 
                                                value={fiber}
                                                className="nutrition-inputs"
                                                placeholder="fiber"
                                                onChange={this.onChangeFiber}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.fiber && <p className="Max-images-warning error-text">{validationErrors.fiber}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="sugars" className="form-label form-label-onethird">SUGAR</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "sugars" 
                                                className="nutrition-inputs"
                                                placeholder="Sugar"
                                                value={sugar}
                                                onChange={this.onChangeSugar}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.sugar && <p className="Max-images-warning error-text">{validationErrors.sugar}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="protien" className="form-label form-label-onethird">PROTIEN</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "protien" 
                                                className="nutrition-inputs"
                                                placeholder="Protien"
                                                value={protien}
                                                onChange={this.onChangeProtien}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.protien && <p className="Max-images-warning error-text">{validationErrors.protien}</p>}
                                    </div>
                                    <div className="single-weight-container">
                                        <div className="single-nutrition">
                                            <label htmlFor="salt" className="form-label form-label-onethird">SALT</label>
                                            <p className="per-hundered-heading">per 100g</p>
                                        </div>
                                        <div className="form-input form-input-half nutrition-input-container">
                                            <input 
                                                type="text" 
                                                id = "salt" 
                                                className="nutrition-inputs" 
                                                placeholder="Salt"
                                                value={salt}
                                                onChange={this.onChangeSalt}
                                            />
                                            <div className="nutrition-input-units">
                                                <p>g</p>
                                            </div>
                                        </div>
                                        {validationErrors.salt && <p className="Max-images-warning error-text">{validationErrors.salt}</p>}
                                    </div>
                            </div>
                        </div>
                    </div>
                    <div className="ingredients-container input-container">
                        <label htmlFor="ingredients" className="form-label">
                            INGREDIENTS
                        </label>
                        <textarea 
                                id="ingredients" 
                                placeholder="Enter Ingredients" 
                                onChange={this.onChangeIngredients} 
                                value={ingredients} 
                                className="description"
                                rows="4"
                                cols="50"
                            ></textarea>
                    </div>
                    <div className="diatory-storage-origin-container weights-container">
                        <div className="single-weight-container diatary-contianer">
                            <label htmlFor="dietary" className="form-label form-label-onethird">DIETARY</label>
                            <select id="dietary" value={dietary}className="form-input form-input-half" onChange={this.onChangeDietary}>
                                <option value="">Select an option</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Lactose-free">Lactose-free</option>
                                <option value="Glutten-free">Glutten-free</option>
                            </select>
                        </div>
                        <div className="single-weight-container storage-container">
                                <label htmlFor="storage" className="form-label form-label-onethird" >STORAGE</label>
                                <input 
                                    type="text" 
                                    id="storage" 
                                    value={storage}
                                    onChange={this.onChangeStorage}
                                    className="form-input form-input-half" 
                                    placeholder="Enter Storage"/>
                        </div>
                        <div className="single-weight-container diatary-contianer">
                            <label htmlFor="origin" className="form-label form-label-onethird">ORIGIN</label>
                            <select id="origin"  value={origin} className="form-input form-input-half" onChange={this.onChangeOrigin}>
                                <option value="">Select a Country</option>
                                {countriesNames.map(each => (<option key={each} value={each}>{each}</option>))}
                            </select>
                        </div>
                    </div>
                    <div className="sufix-prifix-container">
                        <div className="prefix-container input-container-half">
                            <h2 className="form-label form-label-half">PRODUCT ID(PREFIX)</h2>
                            <p className="form-input net-weight">{prefix}</p>
                        </div>
                        <div className="prefix-container input-container-half">
                            <h2 className="form-label form-label-half">PRODUCT ID(SUFFIX)</h2>
                            <p className="form-input net-weight">{suffix}</p>
                        </div>
                        <div className="prefix-container input-container-half">
                            <h2 className="form-label form-label-half">ADDED BY</h2>
                            <p className="form-input net-weight">{username}</p>
                        </div>
                    </div>
                    <div className="image-container">
                        {imageError && <p className="error-msg">{imageError}</p>}
                        {
                            image.length < 4 ? (
                                <>
                                    <label htmlFor="imageUpload" className="form-label form-label-image">Upload an image:</label>
                                    <input type="file" multiple id="imageUpload" key={this.state.imageInputKey} name="imageUpload" accept="image/*" onChange={this.onChangeImage}/>
                                </>
                            ) : <p className="Max-images-warning">Maximum Image uploads reached</p>
                        }
                        <div>
                            {fileNames.map((name, index) => (
                                <div key={index}>{name}</div>
                            ))}
                        </div>
                    </div>
                    <div className="save-submit-button-container">
                        {productsCount < 5 ? ( <button className="button" type="button" onClick={this.onClickSave}>
                            Save
                        </button>) : (
                             <button className="button dummy-save-button" type="button">
                             Save
                         </button>)
                        }
                        {productsCount == 0 ? (<button className="button dummy-save-button">Submit</button>) : <button className="button" type="submit" onClick={this.onClickSubmit}>Submit</button>}
                    </div>
                </form>
                <Previews products={sortedProducts} editPreview = {this.editPreview}/>
            </div>
        )
    }
}

export default Main