    function setName() { 
    console.log("1"+obj.name);   
obj.name = 'Nicholas'; 
console.log("1"+obj.name);  
 obj = "{}";  
obj.name = 'Greg';  
console.log("2"+obj.name);  
}  
var obj = new Object();  
obj.name = "he"
setName();  
console.log("3"+obj.name);  //”Nicholas”   