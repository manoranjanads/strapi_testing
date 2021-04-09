'use strict';

const { dilmahCountries } = require("../../../helpers/countries");
const { dilmahLanguages } = require("../../../helpers/languages");


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx){
        
        return {
            languages: dilmahLanguages.map(l=>{
                return {
                    label:l.label,
                    value:l.value
                }
            }),
            countries: dilmahCountries.map(c=>{
                return {
                    label:c.label,
                    value:c.value,
                    flag:c.flag
                }
            })
        }
    }
};
