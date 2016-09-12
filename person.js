"use strict";

module.exports = function(args){
    args = args || {};

    var props = {};
    props.firstname = args.firstname || 'first name';
    props.lastname = args.lastname || 'last name';

    // this.variablename are public
    this.set = function(key,value){
        if(props[key] !== undefined){
            props[key] = value;
        }
    };
    
    this.get = function(key){
        return props[key];
    };

    this.getFullName = function(){
        return props.firstname  + " " + props.lastname;
    };
};

