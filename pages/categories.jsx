import Layout from "@/components/Layout";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';
import { useEffect, useState } from "react";

function Categories({swal}) {
    const [name,setName] = useState('');
    const [categories,setCategories] = useState([]);
    const [parentCategory,setParentCategory] = useState('');
    const [editedCategory,setEditedCategory] = useState(null);
    const [properties,setProperties] = useState([]);
    useEffect(() => {
        fetchCategories();
    },[])
    function fetchCategories(){
        axios.get('/api/categories').then(result => {
            setCategories(result.data);
        })
    }
    function editCategory(category){
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id);
        setProperties(category.properties.map(({name,values}) => ({
            name,
            values: values.join(',')
        }))
        );
    }
    function deleteCategory(category) {
        swal.fire({
            title: 'Are You Sure ! ',
            text: `Do you want to delete ${category.name} ?`,
            showCancelButton: true,
            cancelButtonText : "Cancel",
            confirmButtonText : "Yes, Delete",
            confirmButtonColor : "#d55",
            reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed) {
            const {_id} = category;
            await axios.delete('/api/categories?_id='+_id);
            fetchCategories();
            }
        })
    }
   async function saveCategory(ev) {
        ev.preventDefault();
        const data = {
            name,
            parentCategory,
            properties : properties.map(p => ({
                name : p.name,
                values: p.values.split(','),
            })),
        }
        if(editedCategory) {
            data._id = editedCategory._id;
            await axios.put('/api/categories',data);
            setEditedCategory(null);
            alert('Updated');
        }else {
            await axios.post('/api/categories',data);
        }
        setName('');
        setParentCategory('');
        setProperties([])
        fetchCategories();
    }
    function addProperty(){
        setProperties(prev => {
            return [...prev,{name:'',values:''}];
        });
    }
    function handlePropertyNameChange(index,property,newName) {
        setProperties(prev => {
          const properties = [...prev];
          properties[index].name = newName;
          return properties;
        });
      }
    function handlePropertyValuesChange(index,property,newValues){
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        });
    }
    function removeProperty(indexToRemove){
        setProperties(prev => {
            return [...prev].filter((p,pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }
    return (
        <Layout>
                <h1>Categories</h1>
                <label>
                    {
                        editedCategory ? `Edit Category ${editedCategory.name}` : 'Create new Category'
                    }
                </label>
                <form onSubmit={saveCategory} >
                    <div className="flex gap-1 mt-4">
                    <input 
                        type="text"
                         placeholder="Category name"
                         value={name}
                         onChange={ev => setName(ev.target.value)}
                        />
                        <select  value={parentCategory} onChange={ev => setParentCategory(ev.target.value)}>
                            <option value="">No parent Category</option>
                            {
                            categories.length > 0 && categories.map(category => (
                                <option value={category._id}>{category.name}</option>
                            ))
                        }
                        </select>
                        </div>
                        <div className="mb-2">
                            <label className="block">Properties</label>
                            <button  type="button" onClick={addProperty} className="btn-default text-sm mb-2 mt-2">Add new Property</button>
                            {properties.length > 0 && properties.map((property,index) => (    
                            <div className="flex gap-1 mb-2" key={property.name}>
                                <input type="text"
                     value={property.name}
                     className="mb-0"
                     onChange={ev => handlePropertyNameChange(index,property,ev.target.value)}
                     placeholder="property name (example: color)"/>
                                    <input 
                                        type="text"
                                        className="mb-0"
                                        onChange={
                                            ev => handlePropertyValuesChange(index,property,ev.target.value)
                                        }
                                        value={property.values}
                                        placeholder="values, comma separated"
                                        />
                                    <button className="btn-red" onClick={() => removeProperty(index)}>Remove</button>
                            </div>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {editedCategory && (
                                <button type="button" className="btn-default" onClick={
                                    () => {
                                        setEditedCategory(null);
                                        setName(' ');
                                        setParentCategory(' ');
                                        setProperties([]);
                                    }
                                }>Cancel</button>
                            )}
                            <button type="submit" className="btn-primary bg-blue-900 text-white">Save</button>
                        </div>
                </form>
                {!editedCategory && (
                <table className="basic mt-4">
                    <thead>
                        <tr>
                            <td>Category name</td>
                            <td>Parent name </td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            categories.length > 0 && categories.map(category => (
                                <tr>
                                    <td>{category.name}</td>
                                    <td>{category?.parent?.name}</td>
                                    <td>
                                        <button className="btn-default mr-2" onClick={() => editCategory(category)}>Edit</button> 
                                        <button className="btn-red" onClick={() => deleteCategory(category)}>Delete</button> 
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                )}
        </Layout>
    )
}
export default withSwal(({swal},ref ) => (
    <Categories swal={swal}/>
))