const { Alias } = require("./alias");
const wordlist = require("../../assets/wordlist");

module.exports.AutoGeneratedAlias = class {
   _numericAlias;
   _wordAlias;

   constructor(index) {
      this._numericAlias = new Alias(index);
      this._wordAlias = new Alias(this._generateNamedAutoAlias(index));
   }

   _generateNamedAutoAlias(index) {
      const resultArray = [];
      const indexFragments = index.toString().split("");
      resultArray.push(wordlist.names[indexFragments.pop()]);
      indexFragments.map((fragment) => {
         resultArray.unshift(wordlist.adjectives[fragment]);
      });
      return resultArray.join("-");
   }

   get numericAlias() {
      return this._numericAlias.value;
   }

   get wordAlias() {
      return this._wordAlias.value;
   }

   get tupleIndex() {
      return parseInt(this.numericAlias);
   }
};
