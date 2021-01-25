const add = async (a, b) => {
	if(b === 7)
    	throw new Error('incorrect number')
    //const c = await a+b;
	//return 15;
	//return {'name': 'Mohit','age': 25};    
	return a+b;
}

const doWork = async () => {
    const sum = await add(4,6);
    const sum2 = await add(sum,6);
    const sum3 =  await add(sum2,10);
    console.log('Sum is '+sum3);
    return sum3;
}

//console.log(add(4,6));

// add(5,7).then((res)=>{
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

//console.log(doWork());

doWork().then((res) => {
    console.log('Resultt', res);
}).catch((err) => {
    console.log('Error test',err);
});
