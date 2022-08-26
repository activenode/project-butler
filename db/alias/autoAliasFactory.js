const wordlist = require("../../assets/wordlist");

module.exports.generateAutoAliasesForIndex = (index) => {
   const autoAliasList = [];
   autoAliasList.push(index.toString());
   autoAliasList.push(generateNamedAutoAlias(index));
   return autoAliasList;
};

function generateNamedAutoAlias(index) {
   return `${generateNamePrefix(index)}${
      wordlist.names[index % wordlist.names.length]
   }`;
}

function generateNamePrefix(index) {
   const countOfPrefixes = index / wordlist.names.length;
   let prefixString = "";
   for (let index = 0; index < countOfPrefixes; index++) {
      prefixString += `${wordlist.adjectives[findRightIndex(index)]} `;
   }
   return prefixString;
}

function findRightIndex(index) {
   if (index >= wordlist.adjectives.length) {
      return findRightIndex(index % wordlist.adjectives.length);
   }
   return index;
}
