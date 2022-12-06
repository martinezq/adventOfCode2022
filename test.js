function oldModelSummary(plateNumberWithSuffix) {
    return JSON.stringify(plateNumberWithSuffix);
}
  
function getUniqueArticleNumberJson(plateNumberWithSuffix) {
     return JSON.stringify(Array.from(getUniqueArticleNumbers(plateNumberWithSuffix)));
}
  
function getUniqueArticleNumbers(plateNumberWithSuffix){
    var uniqueArticleNumber = new Set();
    for(var i=0;i<plateNumberWithSuffix.length;i++) {
        uniqueArticleNumber.add(plateNumberWithSuffix[i]);
    }
    return uniqueArticleNumber;
}
  
function howManyUniqueArticleNumbers(plateNumberWithSuffix){
    return getUniqueArticleNumbers(plateNumberWithSuffix).size;
}

// ------------

const input = ["367117 4484","367117 2403","367117 2403","367017 2403","367117 2403","367117 4411","367117 4444","367117 4411","367117 2403","367117 2403","367017 2403","367117 2403","367117 4404","367117 4451"];

// const result = getUniqueArticleNumberJson(input);
const result = howManyUniqueArticleNumbers(input);

console.log(result);

console.log(JSON.stringify("123"));
console.log("123");