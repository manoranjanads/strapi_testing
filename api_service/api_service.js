const axios = require('axios');

module.exports = {
    async performRequest (url){
        try {
            const res = await axios.get(`${process.env.DMC_BASE_URL}${url}`)
            return res.data
        } catch (error) {
            return {
                success:false,
                error:error
            }
        }
       
    }
} 