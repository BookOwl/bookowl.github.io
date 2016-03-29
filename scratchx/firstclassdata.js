var clean = function(obj){
    if (obj.type != "obj"){
        return obj.val;
    }
    if (obj.val.map){
        return obj.val.map(clean);
    }
    return clean(obj.val);
}
data = Object.create(null);
(function(ext) {
    nextobjid = 1;
    var convertval = function(val){
        if (val[0] == '"' || val[0] == "'") {
            return {type:'str', val:'"'+eval(val)+'"'} 
        }else if (/^\d+$/.exec(val)){
            return {type:'num', val:parseInt(val)} 
        }else if (/^\d+\.\d+$/.exec(val)) {
            return {type:'num', val:parseFloat(val)} 
        }else {
            return data[val]
        }
    }
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
    
    ext.color = function(color){return color;}
    
    ext.create_list = function(){
        var id = "obj" + nextobjid;
        data[id] = {type:"obj", id:id, val:[]};
        nextobjid++;
        return id;
     }
     ext.item_of_list = function(index, id){
        var l = data[id].val;
        var i = l[index-1];
        console.log(i);
        if (i.type == 'obj'){
            console.log("Returning an ID")
            return i.id;
        }else {
            console.log("Returning a val")
            return i.val;
        }
        console.log("Shouldn't be reached")
     }
     ext.set_item = function(index, id, val){
        var l = data[id].val;
        l[index-1] = convertval(val)
     }
     ext.add_item = function(val, id){
        var l = data[id].val;
        l.push(convertval(val))
     }
     ext.list_length = function(id){
         return data[id].val.length;
     }
     ext.delete_item = function(index, id){
         data[id].val.splice(index, 1)
     }
     ext.as_json = function(id){
        var obj = data[id];
        obj = JSON.parse(JSON.stringify(obj))
        obj = clean(obj)
        return JSON.stringify(obj)
     }
    
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
           // ['r', 'Color %c', 'color'],
            ['r', 'create list', 'create_list'],
            ['r', 'item %n of list %s', 'item_of_list'],
            [' ', 'set item %n of list %s to %s', 'set_item'],
            [' ', 'add %s to list %s', 'add_item'],
            ['r', 'length of list %s', 'list_length'],
            [' ', 'delete item %n of list %s', 'delete_item']
            ['r', 'object %s as JSON', 'as_json']
        ]
    };

    // Register the extension
    ScratchExtensions.register('First Class Data', descriptor, ext);
})({});