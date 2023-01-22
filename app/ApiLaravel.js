//const url = 'http://192.168.1.193:8000';

export const sendtoken = async (token) => {

    try {
        const response = await fetch('https://immover.io/api/getoken/'+token);
        // http://192.168.1.193:8000/api/getoken/efijzeifjzegijegp
        console.log("function0");
    
        var json = await response.json();
     
        return json;
  
    } catch (e) {
      
      return json;
      
    }
  
  }