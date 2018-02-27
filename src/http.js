import axios from 'axios'

export function post(url, data = {},dataType) {
    // if(dataType!='upImg'){
    //   data = qs.stringify(data);
    // }
  	return new Promise((resolve, reject) => {
	    axios.post(url, data).then(response => {
	        resolve(response);
	      }, err => {
	        reject(err);
	      })
  })
}
export function hehe() {
	alert(2)
}